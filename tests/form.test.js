import { fireEvent, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import FormExample from './examples/FormExample';

const expectError = (text) =>
  expect(screen.getByText(text)).toBeInTheDocument();
const expectNotError = (text) =>
  expect(screen.queryByText(text)).not.toBeInTheDocument();

describe('form example', () => {
  describe('when validating on change', () => {
    test('errors disappear when typing correct input', async () => {
      render(FormExample, { validateOnChange: true });

      expectError(/the name is required/i);
      expectError(/the name should be at least 6 characters/i);

      await userEvent.type(screen.getByLabelText(/name/i), 'Charlie');

      expectNotError(/the name is required/i);
      expectNotError(/the name should be at least 6 characters/i);
    });
  });
  describe('when not validating on change', () => {
    test('errors do not disappear', async () => {
      render(FormExample, { validateOnChange: false });

      await userEvent.type(screen.getByLabelText(/name/i), 'Charlie');

      expectError(/the name is required/i);
    });
  });

  describe('when stopAtFirstError', () => {
    it('only displays the errors for the first field', async () => {
      render(FormExample, { stopAtFirstError: true });

      expectError(/the name is required/i);
      expectError(/the name should be at least 6 characters/i);

      expectNotError(/the email is required/i);
    });
  });
  describe('when stopAtFirstFieldError', () => {
    it('only displays the first error message for the first failing field', async () => {
      render(FormExample, { stopAtFirstFieldError: true });

      expectError(/the name is required/i);
      expectNotError(/the name should be at least 6 characters/i);
    });
    it('displays the first field errors for all fields', async () => {
      render(FormExample, { stopAtFirstFieldError: true });

      expectError(/the email is required/i);
    });
  });
  describe('when initCheck', () => {
    describe('when valid', () => {
      it('it should validate immediately', async () => {
        render(FormExample, {
          initCheck: true,
          name: 'Unicorn',
          email: 'unicorn@fantasyland.com'
        });

        expectNotError(/the name is required/i);
        expectNotError(/the name should be at least 6 characters/i);
        expectNotError(/the email is required/i);
        expectNotError(/the email is invalid/i);
      });
    });
    describe('when invalid', () => {
      it('it should validate immediately', async () => {
        render(FormExample, {
          initCheck: true
        });

        expectError(/the name is required/i);
        expectError(/the name should be at least 6 characters/i);
        expectError(/the email is required/i);
        expectError(/the email is invalid/i);
      });
    });
  });
  describe('when not initCheck', () => {
    describe('when invalid', () => {
      it('it should not validate immediately', async () => {
        render(FormExample, {
          initCheck: false,
          name: '',
          email: ''
        });

        expectNotError(/the name is required/i);
        expectNotError(/the name should be at least 6 characters/i);
        expectNotError(/the email is required/i);
        expectNotError(/the email is invalid/i);
      });
    });
  });

  describe('validate', () => {
    describe('valid', () => {
      it('should be possible to post form', async () => {
        render(FormExample, {
          initCheck: true,
          email: 'unicorn@fantasyland.com'
        });

        expect(
          screen.getByRole('button', { name: /post form/i })
        ).toBeDisabled();

        await userEvent.type(screen.getByLabelText(/name/i), 'Unicorn');

        await userEvent.click(
          screen.getByRole('button', { name: /validate form/i })
        );

        expect(
          screen.getByRole('button', { name: /post form/i })
        ).not.toBeDisabled();
      });
    });
  });

  describe('custom validators', () => {
    const isLowerCase = (value) => ({
      valid: value === value.toLowerCase(),
      name: 'custom'
    });
    test('synchronous function', async () => {
      render(FormExample, {
        validateOnChange: true,
        name: 'UNICORN',
        email: 'unicorn@fantasyland.com',
        customNameValidators: [isLowerCase]
      });

      expect(screen.getByRole('button', { name: /post form/i })).toBeDisabled();
      expectError(/custom validator error/i);

      await fireEvent.input(screen.getByLabelText(/name/i), {
        target: { value: 'unicorn' }
      });

      expect(
        screen.getByRole('button', { name: /post form/i })
      ).not.toBeDisabled();
      expectNotError(/custom validator error/i);
    });
  });
});
