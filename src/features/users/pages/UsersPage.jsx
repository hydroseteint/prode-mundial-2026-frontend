import { useEffect, useState } from "react";
import {
    Badge,
    Button,
    Card,
    Group,
    Loader,
    Modal,
    PasswordInput,
    Select,
    Stack,
    Table,
    Text,
    TextInput,
    Title
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

import {
    getUsersRequest,
    createUserRequest,
    toggleUserStatusRequest
} from "../services/users.service";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        role: "participant"
    });

    const loadUsers = async () => {
        try {
            const data = await getUsersRequest();
            setUsers(data.users);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCreateUser = async (event) => {
        event.preventDefault();

        try {
            setCreating(true);

            await createUserRequest(formData);

            notifications.show({
                title: "Usuario creado",
                message: "El usuario fue creado correctamente",
                color: "green"
            });

            setFormData({
                name: "",
                username: "",
                password: "",
                role: "participant"
            });

            close();
            await loadUsers();

        } catch (error) {
            notifications.show({
                title: "Error",
                message: error.response?.data?.message || "No se pudo crear el usuario",
                color: "red"
            });
        } finally {
            setCreating(false);
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            await toggleUserStatusRequest(userId);

            notifications.show({
                title: "Estado actualizado",
                message: "El estado del usuario fue actualizado correctamente",
                color: "green"
            });

            await loadUsers();

        } catch (error) {
            notifications.show({
                title: "Error",
                message: error.response?.data?.message || "No se pudo actualizar el estado",
                color: "red"
            });
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <Stack>
            <Title order={1}>Usuarios</Title>

            <Button onClick={open}>
                Crear usuario
            </Button>

            <Modal opened={opened} onClose={close} title="Crear usuario" centered>
                <form onSubmit={handleCreateUser}>
                    <Stack>
                        <TextInput
                            label="Nombre"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <TextInput
                            label="Usuario"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />

                        <PasswordInput
                            label="Contraseña"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <Select
                            label="Rol"
                            value={formData.role}
                            onChange={(value) =>
                                setFormData({
                                    ...formData,
                                    role: value
                                })
                            }
                            data={[
                                { label: "Participante", value: "participant" },
                                { label: "Administrador", value: "admin" }
                            ]}
                        />

                        <Button type="submit" loading={creating}>
                            Crear
                        </Button>
                    </Stack>
                </form>
            </Modal>

            <Card withBorder visibleFrom="sm">
                <Table striped>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Nombre</Table.Th>
                            <Table.Th>Usuario</Table.Th>
                            <Table.Th>Rol</Table.Th>
                            <Table.Th>Estado</Table.Th>
                            <Table.Th>Acciones</Table.Th>
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {users.map((user) => (
                            <Table.Tr key={user._id}>
                                <Table.Td>{user.name}</Table.Td>
                                <Table.Td>{user.username}</Table.Td>
                                <Table.Td>{user.role}</Table.Td>

                                <Table.Td>
                                    <Badge color={user.isActive ? "green" : "red"}>
                                        {user.isActive ? "Activo" : "Inactivo"}
                                    </Badge>
                                </Table.Td>

                                <Table.Td>
                                    <Button
                                        size="xs"
                                        color={user.isActive ? "red" : "green"}
                                        variant="light"
                                        onClick={() => {
                                            const confirmed = window.confirm(
                                                `¿Estás seguro de ${
                                                    user.isActive ? "desactivar" : "activar"
                                                } al usuario ${user.name}?`
                                            );

                                            if (!confirmed) return;

                                            handleToggleStatus(user._id);
                                        }}
                                    >
                                        {user.isActive ? "Desactivar" : "Activar"}
                                    </Button>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Card>

            <Stack hiddenFrom="sm">
                {users.map((user) => (
                    <Card key={user._id} withBorder radius="md" padding="md">
                        <Stack gap="xs">
                            <Group justify="space-between" align="flex-start">
                                <div>
                                    <Text fw={700} size="lg">
                                        {user.name}
                                    </Text>

                                    <Text size="sm" c="dimmed">
                                        Usuario: {user.username}
                                    </Text>
                                </div>

                                <Badge color={user.isActive ? "green" : "red"}>
                                    {user.isActive ? "Activo" : "Inactivo"}
                                </Badge>
                            </Group>

                            <Text size="sm">
                                Rol: {user.role === "admin" ? "Administrador" : "Participante"}
                            </Text>

                            <Button
                                fullWidth
                                color={user.isActive ? "red" : "green"}
                                variant="light"
                                mt="sm"
                                onClick={() => {
                                    const confirmed = window.confirm(
                                        `¿Estás seguro de ${
                                            user.isActive ? "desactivar" : "activar"
                                        } al usuario ${user.name}?`
                                    );

                                    if (!confirmed) return;

                                    handleToggleStatus(user._id);
                                }}
                            >
                                {user.isActive ? "Desactivar" : "Activar"}
                            </Button>
                        </Stack>
                    </Card>
                ))}
            </Stack>
        </Stack>
    );
};

export default UsersPage;