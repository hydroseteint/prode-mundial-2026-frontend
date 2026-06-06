import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Container, Paper, PasswordInput, Text, TextInput, Title} from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { useAuth } from "../../../app/providers/AuthProvider";

const LoginPage = () => {
  const navigate = useNavigate();
  const {login} = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const {name, value} = event.target;

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      await login(formData);

      navigate("/dashboard")

    } catch (error) {
      notifications.show({
        title: "Error al iniciar sesion",
        message: error.response?.data?.message || "Credenciales inválidas",
        color: "red"
      })

    } finally {
      setLoading(false);
    }
  }

  return (
    <Container size={420} my={80}>
      <Title ta="center">
          Prode Mundial 2026
      </Title>

      <Text c="dimmed" size="sm" ta="center" mt={5}>
          Ingresá con las credenciales asignadas por el administrador
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={handleSubmit}>
              <TextInput
                label="Usuario"
                placeholder="Ej: franco"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <PasswordInput
                label="Contraseña"
                placeholder="Tu contraseña"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                mt="md"
              />

              <Button
                fullWidth
                mt="xl"
                type="submit"
                loading={loading}
              >
                Ingresar
              </Button>
          </form>
      </Paper>
    </Container>
  )

}

export default LoginPage