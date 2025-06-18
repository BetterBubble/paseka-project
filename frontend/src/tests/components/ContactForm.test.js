import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import Contact from '../../pages/Contact';
import api from '../../services/api';

// Мокаем модули
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../services/api', () => ({
  post: jest.fn(),
}));

describe('Contact Form', () => {
  beforeEach(() => {
    // Очищаем моки перед каждым тестом
    jest.clearAllMocks();
  });

  const fillForm = async (user) => {
    const nameInput = screen.getByLabelText(/имя/i);
    const emailInput = screen.getByLabelText(/email/i);
    const subjectInput = screen.getByLabelText(/тема/i);
    const messageInput = screen.getByLabelText(/сообщение/i);

    await user.type(nameInput, 'Иван Иванов');
    await user.type(emailInput, 'ivan@example.com');
    await user.type(subjectInput, 'Тестовое сообщение');
    await user.type(messageInput, 'Это тестовое сообщение для проверки формы');
  };

  test('рендерит форму контактов со всеми полями', () => {
    render(<Contact />);

    expect(screen.getByLabelText(/имя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/тема/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/сообщение/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /отправить сообщение/i })).toBeInTheDocument();
  });

  test('отображает контактную информацию', () => {
    render(<Contact />);

    const contactInfo = screen.getByText(/контактная информация/i).closest('.col-md-6');
    
    expect(contactInfo).toBeInTheDocument();
    expect(within(contactInfo).getByText(/телефон/i)).toBeInTheDocument();
    expect(within(contactInfo).getByText(/\+7 \(999\) 123-45-67/)).toBeInTheDocument();
    expect(within(contactInfo).getByText(/info@paseka-babla.ru/)).toBeInTheDocument();
    expect(within(contactInfo).getByText(/московская область/i)).toBeInTheDocument();
    expect(within(contactInfo).getByText(/пн-пт/i)).toBeInTheDocument();
  });

  test('успешно отправляет форму с корректными данными', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    // Мокаем успешный ответ от API
    api.post.mockResolvedValueOnce({ 
      data: { 
        success: true,
        message: 'Сообщение успешно отправлено'
      } 
    });

    // Заполняем форму
    await fillForm(user);

    // Отправляем форму
    const submitButton = screen.getByRole('button', { name: /отправить сообщение/i });
    await user.click(submitButton);

    // Проверяем, что API был вызван с правильными данными
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/contact/', {
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        subject: 'Тестовое сообщение',
        message: 'Это тестовое сообщение для проверки формы'
      });
    });

    // Проверяем, что появилось сообщение об успехе
    expect(toast.success).toHaveBeenCalledWith(
      'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.'
    );

    // Проверяем, что форма очистилась
    await waitFor(() => {
      expect(screen.getByLabelText(/имя/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/тема/i)).toHaveValue('');
      expect(screen.getByLabelText(/сообщение/i)).toHaveValue('');
    });
  });

  test('показывает ошибку при неудачной отправке', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    // Мокаем ошибку от API
    const errorMessage = 'Произошла ошибка при отправке';
    api.post.mockRejectedValueOnce({ 
      response: { 
        data: { 
          error: errorMessage 
        } 
      } 
    });

    // Заполняем форму
    await fillForm(user);

    // Отправляем форму
    const submitButton = screen.getByRole('button', { name: /отправить сообщение/i });
    await user.click(submitButton);

    // Проверяем, что появилось сообщение об ошибке
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    // Проверяем, что данные формы сохранились
    expect(screen.getByLabelText(/имя/i)).toHaveValue('Иван Иванов');
    expect(screen.getByLabelText(/email/i)).toHaveValue('ivan@example.com');
    expect(screen.getByLabelText(/тема/i)).toHaveValue('Тестовое сообщение');
    expect(screen.getByLabelText(/сообщение/i)).toHaveValue('Это тестовое сообщение для проверки формы');
  });

  test('показывает спиннер во время отправки', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    // Мокаем задержку ответа от API
    api.post.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 1000)));

    // Заполняем форму
    await fillForm(user);

    // Отправляем форму
    const submitButton = screen.getByRole('button', { name: /отправить сообщение/i });
    await user.click(submitButton);

    // Проверяем, что появился спиннер и кнопка заблокирована
    expect(screen.getByText(/отправка/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent(/отправка/i);
    expect(screen.getByRole('button').querySelector('.spinner-border')).toBeInTheDocument();
  });

  test('проверяет обязательные поля', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    // Пытаемся отправить пустую форму
    const submitButton = screen.getByRole('button', { name: /отправить сообщение/i });
    await user.click(submitButton);

    // Проверяем, что API не был вызван
    expect(api.post).not.toHaveBeenCalled();

    // Проверяем сообщения об обязательных полях
    expect(screen.getByLabelText(/имя/i)).toBeInvalid();
    expect(screen.getByLabelText(/email/i)).toBeInvalid();
    expect(screen.getByLabelText(/сообщение/i)).toBeInvalid();
  });
}); 