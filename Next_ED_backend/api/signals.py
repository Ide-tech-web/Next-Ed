"""
Django Signals for automated email notifications.
Sends an HTML email to the student when their Q&A question receives a response.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings

from .models import QuestionResponse


@receiver(post_save, sender=QuestionResponse)
def notify_student_on_answer(sender, instance, created, **kwargs):
    """
    When a new QuestionResponse is saved, email the student who asked the question.
    Wrapped in try/except so email failures never crash the API.
    """
    if not created:
        return

    question = instance.question
    student = question.student

    if not student or not student.email:
        return

    # Build responder identity
    responder = instance.admin
    if responder:
        responder_name = f"{responder.first_name} {responder.last_name}".strip() or responder.email
        responder_role = responder.get_role_display() if hasattr(responder, 'get_role_display') else responder.role
    else:
        responder_name = "A team member"
        responder_role = "Staff"

    # Direct link to the Q&A page
    qa_link = f"{settings.FRONTEND_URL}/questions"

    # Build HTML email
    subject = f"Next-Ed — Your question has been answered!"
    html_message = f"""
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #e0e0e0;
                border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #2A9D8F, #264653); padding: 24px 32px;">
            <h1 style="margin: 0; color: white; font-size: 24px;">Next-Ed 📚</h1>
        </div>
        <div style="padding: 32px;">
            <p style="font-size: 16px; margin-bottom: 20px;">
                Hi <strong>{student.first_name or 'Student'}</strong>,
            </p>
            <p style="font-size: 16px; margin-bottom: 20px;">
                Your question has been answered by <strong>{responder_name}</strong>
                ({responder_role}).
            </p>
            <div style="background: rgba(42, 157, 143, 0.15); border-left: 4px solid #2A9D8F;
                        padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0;">
                <p style="margin: 0 0 8px; color: #999; font-size: 13px;">Your question:</p>
                <p style="margin: 0; font-size: 15px; color: #ddd;">
                    {question.question_text[:200]}{'...' if len(question.question_text) > 200 else ''}
                </p>
            </div>
            <div style="background: rgba(244, 162, 97, 0.15); border-left: 4px solid #F4A261;
                        padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0;">
                <p style="margin: 0 0 8px; color: #999; font-size: 13px;">Response:</p>
                <p style="margin: 0; font-size: 15px; color: #ddd;">
                    {instance.response_text[:300]}{'...' if len(instance.response_text) > 300 else ''}
                </p>
            </div>
            <a href="{qa_link}" style="display: inline-block; padding: 12px 28px;
               background: linear-gradient(135deg, #2A9D8F, #21867a); color: white;
               text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;
               margin-top: 10px;">
                View Full Thread →
            </a>
        </div>
        <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.1);
                    text-align: center; color: #666; font-size: 12px;">
            Next-Ed Educational Platform — This is an automated notification.
        </div>
    </div>
    """

    plain_message = (
        f"Hi {student.first_name or 'Student'},\n\n"
        f"Your question has been answered by {responder_name} ({responder_role}).\n\n"
        f"Question: {question.question_text[:200]}\n"
        f"Response: {instance.response_text[:300]}\n\n"
        f"View the full thread: {qa_link}\n"
    )

    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[student.email],
            html_message=html_message,
            fail_silently=False,
        )
    except Exception as e:
        # Log but never crash — the Answer is already saved
        print(f"[Signal] Failed to send Q&A notification to {student.email}: {e}")
