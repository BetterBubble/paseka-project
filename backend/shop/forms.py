from django import forms
from .models import Review, Contact, Feedback, Order, Product
from django.core.validators import EmailValidator

class MultipleFileInput(forms.ClearableFileInput):
    """Кастомный виджет для загрузки нескольких файлов"""
    allow_multiple_selected = True

class MultipleFileField(forms.FileField):
    """Кастомное поле для загрузки нескольких файлов"""
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput())
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = single_file_clean(data, initial)
        return result

class ContactForm(forms.ModelForm):
    def clean_email(self):
        email = self.cleaned_data['email']
        if not email.endswith(('.ru', '.com', '.org')):
            raise forms.ValidationError('Пожалуйста, используйте действительный email-адрес с доменом .ru, .com или .org')
        return email

    def clean_name(self):
        name = self.cleaned_data['name']
        if len(name.split()) < 2:
            raise forms.ValidationError('Пожалуйста, введите полное имя (имя и фамилию)')
        return name.title()  # Преобразует "иван иванов" в "Иван Иванов"

    class Meta:
        model = Contact
        fields = ['name', 'email', 'subject', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control shadow-sm',
                'placeholder': 'Представьтесь, пожалуйста'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control shadow-sm',
                'placeholder': 'example@mail.ru'
            }),
            'subject': forms.TextInput(attrs={
                'class': 'form-control shadow-sm',
                'placeholder': 'О чём хотите написать?'
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-control shadow-sm',
                'placeholder': 'Напишите ваше сообщение здесь...',
                'rows': 5
            })
        }
        help_texts = {
            'email': 'Мы никогда не передадим ваш email третьим лицам',
            'message': 'Подробно опишите ваш вопрос или предложение'
        }


class FeedbackForm(forms.ModelForm):
    def clean_message(self):
        message = self.cleaned_data['message']
        if len(message.split()) < 10:
            raise forms.ValidationError('Сообщение должно содержать не менее 10 слов')
        return message

    def clean_feedback_type(self):
        feedback_type = self.cleaned_data['feedback_type']
        if feedback_type == 'complaint':
            # Если это жалоба, проверяем, есть ли сообщение
            message = self.data.get('message', '')
            if len(message) < 50:
                raise forms.ValidationError('Для жалобы требуется более подробное описание (минимум 50 символов)')
        return feedback_type

    class Meta:
        model = Feedback
        fields = ['name', 'email', 'feedback_type', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control shadow-sm',
                'placeholder': 'Представьтесь, пожалуйста'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control shadow-sm',
                'placeholder': 'example@mail.ru'
            }),
            'feedback_type': forms.Select(attrs={
                'class': 'form-control shadow-sm'
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-control shadow-sm',
                'placeholder': 'Напишите ваше сообщение здесь...',
                'rows': 5
            })
        }
        help_texts = {
            'feedback_type': 'Выберите тип обращения, чтобы мы могли быстрее его обработать',
            'message': 'Опишите вашу ситуацию как можно подробнее'
        }


class ReviewForm(forms.ModelForm):
    def clean_rating(self):
        rating = self.cleaned_data['rating']
        if rating < 1 or rating > 5:
            raise forms.ValidationError('Оценка должна быть от 1 до 5')
        return rating

    def clean_comment(self):
        comment = self.cleaned_data['comment']
        try:
            rating = self.cleaned_data['rating']
            if rating == 1 and len(comment) < 100:
                raise forms.ValidationError('Для низкой оценки (1 звезда) необходимо подробное объяснение (минимум 100 символов)')
        except KeyError:
            # Если rating еще не прошел валидацию
            pass
        return comment

    def clean(self):
        cleaned_data = super().clean()
        rating = cleaned_data.get('rating')
        comment = cleaned_data.get('comment')
        
        if rating and rating <= 3 and (not comment or len(comment) < 50):
            raise forms.ValidationError(
                'Для оценки 3 и ниже необходимо оставить комментарий (минимум 50 символов)'
            )
        return cleaned_data

    class Meta:
        model = Review
        fields = ['rating', 'comment']
        labels = {
            'rating': 'Оценка',
            'comment': 'Ваш отзыв'
        }
        widgets = {
            'rating': forms.Select(
                attrs={
                    'class': 'form-control shadow-sm'
                }
            ),
            'comment': forms.Textarea(
                attrs={
                    'class': 'form-control shadow-sm',
                    'placeholder': 'Поделитесь вашими впечатлениями о товаре...',
                    'rows': 4
                }
            )
        }
        help_texts = {
            'rating': 'Оцените товар по шкале от 1 до 5',
            'comment': 'Расскажите, что вам понравилось или не понравилось'
        }


class OrderCreateForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['delivery_address', 'delivery_method']
        widgets = {
            'delivery_address': forms.TextInput(attrs={
                'class': 'form-control shadow-sm',
                'placeholder': 'Введите адрес доставки'
            }),
            'delivery_method': forms.Select(attrs={
                'class': 'form-control shadow-sm'
            })
        }
        help_texts = {
            'delivery_address': 'Укажите полный адрес доставки, включая индекс',
            'delivery_method': 'Выберите удобный способ доставки'
        }

    def clean_delivery_address(self):
        address = self.cleaned_data['delivery_address']
        if len(address.split(',')) < 2:
            raise forms.ValidationError(
                'Пожалуйста, укажите полный адрес (город, улица, дом)'
            )
        return address


class ProductImageUploadForm(forms.ModelForm):
    """Форма для загрузки изображений товара с демонстрацией request.FILES"""
    
    # Кастомное поле для дополнительных изображений
    additional_images = MultipleFileField(
        label='Дополнительные изображения',
        required=False,
        help_text='Можно выбрать несколько изображений'
    )
    
    # CharField с Textarea widget
    upload_description = forms.CharField(
        label='Описание загрузки',
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 3,
            'placeholder': 'Опишите загружаемые изображения...'
        }),
        required=False
    )
    
    class Meta:
        model = Product
        fields = ['name', 'image', 'manual']  # Убираем upload_description из полей модели
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Название товара'
            }),
            'image': forms.FileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
            'manual': forms.FileInput(attrs={
                'class': 'form-control',
                'accept': '.pdf,.doc,.docx'
            })
        }
        labels = {
            'name': 'Название товара',
            'image': 'Основное изображение',
            'manual': 'Инструкция (PDF/DOC)'
        }
        help_texts = {
            'image': 'Загрузите основное изображение товара (JPG, PNG)',
            'manual': 'Загрузите инструкцию по использованию товара'
        }
        error_messages = {
            'name': {
                'required': 'Название товара обязательно для заполнения',
                'max_length': 'Название не должно превышать 200 символов'
            },
            'image': {
                'invalid': 'Загрузите корректное изображение'
            }
        }
    
    class Media:
        """Демонстрация class Media для подключения CSS и JS"""
        css = {
            'all': (
                'admin/css/forms.css',
                'shop/css/upload-form.css',
            )
        }
        js = (
            'admin/js/core.js',
            'shop/js/image-preview.js',
            'shop/js/file-validation.js',
        )
    
    def clean_image(self):
        """Валидация изображения"""
        image = self.cleaned_data.get('image')
        if image:
            if image.size > 5 * 1024 * 1024:  # 5MB
                raise forms.ValidationError('Размер изображения не должен превышать 5MB')
            if not image.content_type.startswith('image/'):
                raise forms.ValidationError('Файл должен быть изображением')
        return image
    
    def clean_manual(self):
        """Валидация файла инструкции"""
        manual = self.cleaned_data.get('manual')
        if manual:
            allowed_types = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
            if manual.content_type not in allowed_types:
                raise forms.ValidationError('Инструкция должна быть в формате PDF или DOC')
            if manual.size > 10 * 1024 * 1024:  # 10MB
                raise forms.ValidationError('Размер файла не должен превышать 10MB')
        return manual 