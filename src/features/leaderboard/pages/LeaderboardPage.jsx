import { useEffect, useState } from "react";
import {
    Badge,
    Card,
    Center,
    Group,
    Loader,
    Stack,
    Table,
    Text,
    Title,
    SimpleGrid
} from "@mantine/core";

import { getLeaderboardRequest } from "../services/leaderboard.service";
import { useAuth } from "../../../app/providers/AuthProvider";

const LeaderboardPage = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                const data = await getLeaderboardRequest();
                setLeaderboard(data.leaderboard);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        loadLeaderboard();
    }, []);

    if (loading) {
        return (
            <Center h={300}>
                <Loader size="lg" />
            </Center>
        );
    }

    const getPositionLabel = (position) => {
        if (position === 1) return "🥇 #1";
        if (position === 2) return "🥈 #2";
        if (position === 3) return "🥉 #3";

        return `#${position}`;
    };

    return (
        <Stack>
            <div>
                <Title order={1}>Ranking</Title>
                <Text c="dimmed">
                    Tabla general de participantes del Prode Mundial 2026.
                </Text>
            </div>

            <Card withBorder radius="md" padding="lg" visibleFrom="sm">
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Posición</Table.Th>
                            <Table.Th>Participante</Table.Th>
                            <Table.Th ta="center">Aciertos parciales</Table.Th>
                            <Table.Th ta="center">Exactos</Table.Th>
                            <Table.Th ta="center">Puntos</Table.Th>
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {leaderboard.map((player) => (
                            <Table.Tr key={player.id}
                            bg={player.username === user?.username ? "blue.0" : undefined}>
                                <Table.Td>
                                    <Badge variant="light">
                                        {getPositionLabel(player.position)}
                                    </Badge>
                                </Table.Td>
                                
                                <Table.Td>
                                    <Group gap="xs">
                                        <Text fw={600}>
                                            {player.name}
                                        </Text>

                                        {player.username === user?.username && (
                                            <Badge color="blue" variant="light">
                                                Vos
                                            </Badge>
                                        )}
                                    </Group>
                                </Table.Td>

                                <Table.Td ta="center">{player.correctWinner}</Table.Td>

                                <Table.Td ta="center">{player.exactResults}</Table.Td>

                                <Table.Td ta="center">
                                    <Text fw={700}>
                                        {player.totalPoints}
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Card>

            <Stack hiddenFrom="sm">
                {leaderboard.map((player) => {
                    const isCurrentUser = player.username === user?.username;

                    return (
                        <Card
                            key={player.id}
                            withBorder
                            radius="md"
                            padding="lg"
                            bg={isCurrentUser ? "blue.0" : undefined}
                        >
                            <Group justify="space-between" align="flex-start">
                                <div>
                                    <Text size="1.2rem" fw={900} c="blue">
                                        {getPositionLabel(player.position)}
                                    </Text>

                                    <Text size="xs" c="dimmed">
                                        Posición
                                    </Text>

                                    <Text fw={700} size="lg" mt="md">
                                        {player.name}
                                    </Text>

                                    {isCurrentUser && (
                                        <Badge color="blue" variant="light" mt="xs">
                                            Vos
                                        </Badge>
                                    )}
                                </div>

                                <div>
                                    <Text size="xs" c="dimmed" ta="right">
                                        Puntos
                                    </Text>

                                    <Text fw={900} size="1.7rem" ta="right">
                                        {player.totalPoints}
                                    </Text>
                                </div>
                            </Group>

                            <SimpleGrid cols={2} mt="lg">
                                <Card withBorder radius="md" padding="sm">
                                    <Text size="sm" c="dimmed" ta="center">
                                        Exactos
                                    </Text>

                                    <Text fw={700} ta="center">
                                        {player.exactResults}
                                    </Text>
                                </Card>

                                <Card withBorder radius="md" padding="sm">
                                    <Text size="sm" c="dimmed" ta="center">
                                        Parciales
                                    </Text>

                                    <Text fw={700} ta="center">
                                        {player.correctWinner}
                                    </Text>
                                </Card>
                            </SimpleGrid>
                        </Card>
                    );
                })}
            </Stack>
        </Stack>
    );
};

export default LeaderboardPage;