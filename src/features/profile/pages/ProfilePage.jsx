import { useEffect, useState } from "react";
import {
    Badge,
    Card,
    Center,
    Grid,
    Loader,
    SimpleGrid,
    Stack,
    Text,
    Title
} from "@mantine/core";
import {
    IconChartBar,
    IconCircleCheck,
    IconTarget,
    IconTrophy
} from "@tabler/icons-react";

import { useAuth } from "../../../app/providers/AuthProvider";
import { getMyStatsRequest } from "../../dashboard/services/dashboard.service";

const ProfilePage = () => {
    const { user } = useAuth();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await getMyStatsRequest();
                setStats(data.stats);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    if (loading) {
        return (
            <Center h={300}>
                <Loader size="lg" />
            </Center>
        );
    }

    const statCards = [
        {
            title: "Puntos totales",
            value: stats?.totalPoints ?? 0,
            icon: IconTrophy
        },
        {
            title: "Predicciones",
            value: stats?.totalPredictions ?? 0,
            icon: IconTarget
        },
        {
            title: "Exactos",
            value: stats?.exactResults ?? 0,
            icon: IconCircleCheck
        },
        {
            title: "Aciertos parciales",
            value: stats?.correctWinner ?? 0,
            icon: IconCircleCheck
        },
        {
            title: "Precisión",
            value: `${stats?.accuracy ?? 0}%`,
            icon: IconChartBar
        }
    ];

    return (
        <Stack>
            <div>
                <Title order={1}>Mi perfil</Title>
                <Text c="dimmed">
                    Información de tu cuenta y rendimiento en el Prode Mundial 2026.
                </Text>
            </div>

            <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder radius="md" padding="lg" h="100%">
                        <Title order={3}>Información de cuenta</Title>

                        <Text mt="md" fw={700} size="lg">
                            {user?.name}
                        </Text>

                        <Text c="dimmed">
                            Usuario: {user?.username}
                        </Text>

                        <Badge mt="md" variant="light">
                            {user?.role === "admin" ? "Administrador" : "Participante"}
                        </Badge>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card withBorder radius="md" padding="lg" h="100%">
                        <Title order={3}>Resumen general</Title>

                        <Text mt="md">
                            Pronósticos cargados{" "} : <strong>{stats?.totalPredictions ?? 0}</strong>
                        </Text>

                        <Text mt="sm">
                            Puntos acumulados : <strong>{stats?.totalPoints ?? 0}</strong> 
                        </Text>
                    </Card>
                </Grid.Col>
            </Grid>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }} spacing="md">
                {statCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <Card key={card.title} withBorder radius="md" padding="lg">
                            <Icon size={24} />

                            <Text c="dimmed" mt="md">
                                {card.title}
                            </Text>

                            <Title order={2}>
                                {card.value}
                            </Title>
                        </Card>
                    );
                })}
            </SimpleGrid>
        </Stack>
    );
};

export default ProfilePage;