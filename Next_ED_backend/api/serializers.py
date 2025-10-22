# Next_ED_Backend/api/serializers.py

from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    # Field to receive password
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        style={'input_type': 'password'}
    )
    # Field to confirm password (not saved to DB)
    password2 = serializers.CharField(
        write_only=True, 
        required=True, 
        style={'input_type': 'password'}
    )

    class Meta:
        model = CustomUser
        # Fields the API will accept for registration
        fields = ('email', 'first_name', 'last_name', 'password', 'password2')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    # --- Validation ---
    def validate(self, attrs):
        # Ensure password and password2 match
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    # --- Creation ---
    def create(self, validated_data):
        # This method is called when the data is valid
        # We use CustomUser's built-in manager to safely create the user and hash the password
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            password=validated_data['password']
        )
        # Role defaults to 'STUDENT' in the model, so no need to set it here!
        return user
