ინსტალაციის ინტრუქცია
============

ბიბლიოთეკების ინსტალაცია
```console
pip install -r requirements.txt
```

ბაზის ინსტალაცია

1. მონაცემთა ბაზის შექმნა pgAdmin - დან და shop/settings.py - ში კონფიგურირება ხაზი 80
2. ბაზის მიგრაციების გაშვება
```console
python manage.py migrate
```

Django სამართავი სისტემის მომხმარებლის რეგისტრაცია
```console
python manage.py createsuperuser
```

მონაცემთა ბაზის შევსება არსებული seed.json ფაილით
```console
python manage.py loaddata seed.json
```

საბოლოო ეტაპი სერვერის გაშვება
```console
python manage.py runserver
```