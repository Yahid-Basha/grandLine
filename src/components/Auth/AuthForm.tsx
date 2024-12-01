import React from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

interface AuthFormProps {
  onSubmit: (data: any) => void;
  fields: Array<{
    name: string;
    label: string;
    type?: string;
    required?: boolean;
  }>;
  error?: string;
  isLoading?: boolean;
  submitText: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  onSubmit,
  fields,
  error,
  isLoading,
  submitText,
}) => {
  const { control, handleSubmit } = useForm();

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {fields.map((field) => (
        <Controller
          key={field.name}
          name={field.name}
          control={control}
          defaultValue=""
          rules={{ required: field.required !== false }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              margin="normal"
              required={field.required !== false}
              fullWidth
              id={field.name}
              label={field.label}
              type={field.type || 'text'}
              autoComplete={field.name}
              onChange={onChange}
              value={value}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      ))}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? 'Please wait...' : submitText}
      </Button>
    </Box>
  );
};

export default AuthForm;