from typing import Any, Tuple, List

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator


def get_choices(constants_class: Any) -> List[Tuple[str, str]]:
    return [
        (value, value)
        for key, value in vars(constants_class).items()
        if not key.startswith('__')
    ]


class DeliveryScheduleConstants:
    EXPRESS = 'express'
    MORNING = 'morning'
    NOON = 'noon'
    AFTERNOON = 'afternoon'
    EVENING = 'evening'


class RegisterForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def clean_email(self):
        email = self.cleaned_data["email"]
        if User.objects.filter(email=email).exists():
            raise ValidationError("მომხმარებელი მსგავსი ელ-ფოსტით უკვე არსებობს!")
        return email


class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)


class CheckoutForm(forms.Form):
    firstname = forms.CharField(required=True, min_length=2, max_length=30)
    lastname = forms.CharField(required=True, min_length=2, max_length=30)
    phone = forms.CharField(required=True, validators=[RegexValidator(
        regex=r'^(\+\d{1,3})?,?\s?\d{9,13}',
        message="არ გამოიყენოთ + სიმბოლო, თუ ნომერი არ დაიწყება 995 - ით მაგ: +995555000000, 555000000"
    )])
    city = forms.CharField(required=True, min_length=3, max_length=30)
    region = forms.CharField(required=False, min_length=3, max_length=150)
    address = forms.CharField(required=True, min_length=10, max_length=150)
    second_address = forms.CharField(required=False, min_length=10, max_length=150)
    additional_info = forms.CharField(required=False, min_length=10, max_length=500)
    delivery_schedule = forms.ChoiceField(
        required=True,
        choices=get_choices(DeliveryScheduleConstants)
    )
