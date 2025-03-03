from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):

    use_in_migrations = True

    def _create_user(self, email, phone_number, password, **extra_fields):
        '''Create and save a user with the given email, phone number, and
        password
        '''
        if not email:
            raise ValueError("No email provided")

        if not phone_number:
            raise ValueError("Phone number is required")

        email = self.normalize_email(email)
        phone_number = phone_number.lstrip("+") 
        user = self.model(email=email, phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, phone_number, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, phone_number, password, **extra_fields)

    def create_superuser(self, email, phone_number, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        assert(extra_fields.get("is_staff"))
        assert(extra_fields.get("is_superuser"))
        return self._create_user(email, phone_number, password, **extra_fields)
