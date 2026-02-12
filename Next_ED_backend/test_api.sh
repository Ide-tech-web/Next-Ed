#!/bin/bash

# Next-Ed Backend API Testing Script
# This script tests all major API endpoints

BASE_URL="http://localhost:8000/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=================================="
echo "Next-Ed Backend API Testing"
echo "=================================="
echo ""

# Variables to store tokens
STUDENT_TOKEN=""
ADMIN_TOKEN=""

# Test 1: Register Student
echo "Test 1: Registering a student..."
RESPONSE=$(curl -s -X POST ${BASE_URL}/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.student@school.com",
    "first_name": "Test",
    "last_name": "Student",
    "password": "testpass123",
    "password2": "testpass123"
  }')

if echo "$RESPONSE" | grep -q "successfully created"; then
    echo -e "${GREEN}✓ Student registration successful${NC}"
else
    echo -e "${RED}✗ Student registration failed${NC}"
fi
echo "$RESPONSE" | python3 -m json.tool
echo ""

# Test 2: Register Admin (will need to set role via admin panel)
echo "Test 2: Registering an admin user..."
RESPONSE=$(curl -s -X POST ${BASE_URL}/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.admin@school.com",
    "first_name": "Test",
    "last_name": "Admin",
    "password": "adminpass123",
    "password2": "adminpass123"
  }')

if echo "$RESPONSE" | grep -q "successfully created"; then
    echo -e "${GREEN}✓ Admin registration successful${NC}"
else
    echo -e "${RED}✗ Admin registration failed${NC}"
fi
echo "$RESPONSE" | python3 -m json.tool
echo ""

# Test 3: Login as Student
echo "Test 3: Logging in as student..."
RESPONSE=$(curl -s -X POST ${BASE_URL}/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.student@school.com",
    "password": "testpass123"
  }')

if echo "$RESPONSE" | grep -q "access"; then
    STUDENT_TOKEN=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['access'])")
    echo -e "${GREEN}✓ Student login successful${NC}"
    echo "Access token: ${STUDENT_TOKEN:0:50}..."
else
    echo -e "${RED}✗ Student login failed${NC}"
fi
echo ""

# Test 4: Get User Profile
echo "Test 4: Getting user profile..."
RESPONSE=$(curl -s -X GET ${BASE_URL}/users/profile/ \
  -H "Authorization: Bearer ${STUDENT_TOKEN}")

if echo "$RESPONSE" | grep -q "email"; then
    echo -e "${GREEN}✓ Profile retrieval successful${NC}"
else
    echo -e "${RED}✗ Profile retrieval failed${NC}"
fi
echo "$RESPONSE" | python3 -m json.tool
echo ""

# Test 5: Try to create a course as student (should fail)
echo "Test 5: Attempting to create course as student (should fail)..."
RESPONSE=$(curl -s -X POST ${BASE_URL}/courses/ \
  -H "Authorization: Bearer ${STUDENT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Course",
    "description": "This should fail",
    "level": 1
  }')

if echo "$RESPONSE" | grep -q "permission"; then
    echo -e "${GREEN}✓ Permission check working (student cannot create course)${NC}"
else
    echo -e "${RED}✗ Permission check failed${NC}"
fi
echo "$RESPONSE" | python3 -m json.tool
echo ""

# Test 6: List all courses (should work for students)
echo "Test 6: Listing all courses (student access)..."
RESPONSE=$(curl -s -X GET ${BASE_URL}/courses/ \
  -H "Authorization: Bearer ${STUDENT_TOKEN}")

if echo "$RESPONSE" | grep -q "\["; then
    echo -e "${GREEN}✓ Course listing successful${NC}"
else
    echo -e "${RED}✗ Course listing failed${NC}"
fi
echo "$RESPONSE" | python3 -m json.tool
echo ""

# Test 7: List notes
echo "Test 7: Listing notes..."
RESPONSE=$(curl -s -X GET ${BASE_URL}/notes/ \
  -H "Authorization: Bearer ${STUDENT_TOKEN}")

if echo "$RESPONSE" | grep -q "\["; then
    echo -e "${GREEN}✓ Notes listing successful${NC}"
else
    echo -e "${RED}✗ Notes listing failed${NC}"
fi
echo "$RESPONSE" | python3 -m json.tool
echo ""

# Test 8: List exercises
echo "Test 8: Listing exercises..."
RESPONSE=$(curl -s -X GET ${BASE_URL}/exercises/ \
  -H "Authorization: Bearer ${STUDENT_TOKEN}")

if echo "$RESPONSE" | grep -q "\["; then
    echo -e "${GREEN}✓ Exercises listing successful${NC}"
else
    echo -e "${RED}✗ Exercises listing failed${NC}"
fi
echo ""

# Test 9: List exams
echo "Test 9: Listing exams..."
RESPONSE=$(curl -s -X GET ${BASE_URL}/exams/ \
  -H "Authorization: Bearer ${STUDENT_TOKEN}")

if echo "$RESPONSE" | grep -q "\["; then
    echo -e "${GREEN}✓ Exams listing successful${NC}"
else
    echo -e "${RED}✗ Exams listing failed${NC}"
fi
echo ""

# Test 10: Get student progress
echo "Test 10: Getting student progress..."
RESPONSE=$(curl -s -X GET ${BASE_URL}/progress/ \
  -H "Authorization: Bearer ${STUDENT_TOKEN}")

if echo "$RESPONSE" | grep -q "\["; then
    echo -e "${GREEN}✓ Progress retrieval successful${NC}"
else
    echo -e "${RED}✗ Progress retrieval failed${NC}"
fi
echo "$RESPONSE" | python3 -m json.tool
echo ""

echo "=================================="
echo "Testing Complete!"
echo "=================================="
echo ""
echo "IMPORTANT NOTE:"
echo "To test admin functionality:"
echo "1. Create a superuser: python3 manage.py createsuperuser"
echo "2. Login to admin panel: http://localhost:8000/admin/"
echo "3. Change test.admin@school.com user role to 'ADMIN'"
echo "4. Login via API to get admin token"
echo "5. Use admin token to test create/update/delete operations"
echo ""
echo "For file upload testing, use the admin panel or curl commands like:"
echo "curl -X POST http://localhost:8000/api/notes/ \\"
echo "  -H \"Authorization: Bearer ADMIN_TOKEN\" \\"
echo "  -F \"title=Test Note\" \\"
echo "  -F \"course=1\" \\"
echo "  -F \"level=1\" \\"
echo "  -F \"file=@test.pdf\""
