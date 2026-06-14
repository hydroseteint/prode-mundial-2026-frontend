import { useEffect, useState } from "react";
import {
    SimpleGrid,
    Card,
    Text,
    Title,
    Group,
    Loader,
    Center,
    Stack,
    Badge,
    Box
} from "@mantine/core";
import {
    IconTrophy,
    IconTarget,
    IconChartBar,
    IconCircleCheck
} from "@tabler/icons-react";

import { useAuth } from "../../../app/providers/AuthProvider";
import { getMyStatsRequest, getLeaderboardRequest, getNextArgentinaMatchRequest, getTodayMatchesRequest } from "../services/dashboard.service";
import { getCountdown } from "../../../shared/utils/date.utils";
import { getTeamFlagUrl } from "../../../shared/utils/team.utils";

const DashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [position, setPosition] = useState("-");
    const [nextArgentinaMatch, setNextArgentinaMatch] = useState(null);
    const [todayMatches, setTodayMatches] = useState([]);
    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const [countdown, setCountdown] = useState(null);

    useEffect(() => {
    const loadStats = async () => {
        try {
            const data = await getMyStatsRequest();
            setStats(data.stats);

            const leaderboardData = await getLeaderboardRequest();

            const argentinaMatchData = await getNextArgentinaMatchRequest();
            setNextArgentinaMatch(argentinaMatchData.match);

            const todayMatchesData = await getTodayMatchesRequest();

            setTodayMatches(todayMatchesData.matches);
            setUpcomingMatches(todayMatchesData.upcomingMatches);

            const currentUserPosition = leaderboardData.leaderboard.find(
                (player) => player.username === user?.username
            );

            setPosition(
                currentUserPosition ? currentUserPosition.position : "-"
            );

          } catch (error) {
              console.log(error);
          } finally {
              setLoading(false);
          }
      }; 
      loadStats()}, []);

      useEffect(() => {
        if (!nextArgentinaMatch) return;

        const updateCountdown = () => {
            const timeLeft = getCountdown(nextArgentinaMatch.startDate);
            setCountdown(timeLeft);
        };

        updateCountdown();

        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
        }, [nextArgentinaMatch]);

    if (loading) {
        return (
            <Center h={300}>
                <Loader size="lg" />
            </Center>
        );
    }

    const cards = [
        {
            title: "Puntos totales",
            value: stats?.totalPoints ?? 0,
            icon: IconTrophy,
            description: "Puntos acumulados"
        },
        {
            title: "Posición",
            value: `#${position}`,
            icon: IconTrophy,
            description: "Ranking actual"
        },
        {
            title: "Predicciones",
            value: stats?.totalPredictions ?? 0,
            icon: IconTarget,
            description: "Pronósticos cargados"
        },
        {
            title: "Precisión",
            value: `${stats?.accuracy ?? 0}%`,
            icon: IconChartBar,
            description: "Aciertos sobre partidos calculados"
        }
    ];

    return (
        <Stack gap="lg">
            <Group justify="space-between">
                <div>
                    <Title order={1}>Hola {user?.name} 👋</Title>
                    <Text c="dimmed" mt={4}>
                        Este es tu resumen del Prode Mundial 2026.
                    </Text>
                </div>

                <Badge size="lg" variant="light">
                    {user?.role === "admin" ? "Administrador" : "Participante"}
                </Badge>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <Card key={card.title} withBorder radius="md" padding="lg">
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed" fw={500}>
                                    {card.title}
                                </Text>

                                <Icon size={22} />
                            </Group>

                            <Title order={2} mt="md">
                                {card.value}
                            </Title>

                            <Text size="sm" c="dimmed" mt={4}>
                                {card.description}
                            </Text>
                        </Card>
                    );
                })}
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                <Card withBorder radius="md" padding="lg">
                    <Title order={3}>Próximo partido de Argentina 🇦🇷</Title>

                    {nextArgentinaMatch ? (
                        <>
                            <Group justify="center" mt="lg">
                                <Stack align="center" gap={2}>
                                    {getTeamFlagUrl(nextArgentinaMatch.homeTeam) && <img src={getTeamFlagUrl(nextArgentinaMatch.homeTeam)} alt={nextArgentinaMatch.homeTeam} width={40} height={27} style={{ objectFit: "cover", border: "1px solid #dee2e6", borderRadius: 2 }} />}

                                    <Text fw={700} size="xl">
                                        {nextArgentinaMatch.homeTeam}
                                    </Text>
                                </Stack>

                                <Text
                                    fw={900}
                                    size="xl"
                                    mx="lg"
                                >
                                    VS
                                </Text>

                                <Stack align="center" gap={2}>
                                    {getTeamFlagUrl(nextArgentinaMatch.awayTeam) && <img src={getTeamFlagUrl(nextArgentinaMatch.awayTeam)} alt={nextArgentinaMatch.awayTeam} width={40} height={27} style={{ objectFit: "cover", border: "1px solid #dee2e6", borderRadius: 2 }} />}

                                    <Text fw={700} size="xl">
                                        {nextArgentinaMatch.awayTeam}
                                    </Text>
                                </Stack>
                            </Group>

                            <Text c="dimmed" mt={4}>
                                {new Date(nextArgentinaMatch.startDate).toLocaleString("es-AR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </Text>

                            <Badge mt="md" variant="light">
                                {nextArgentinaMatch.stage}
                            </Badge>

                            {countdown && (
                            <>
                                <Text fw={700} mt="lg">
                                    Faltan
                                </Text>

                                <SimpleGrid cols={4} mt="sm">
                                    <Card withBorder padding="sm" radius="md">
                                        <Text fw={700} ta="center">
                                            {countdown.days}
                                        </Text>
                                        <Text size="xs" c="dimmed" ta="center">
                                            Días
                                        </Text>
                                    </Card>

                                    <Card withBorder padding="sm" radius="md">
                                        <Text fw={700} ta="center">
                                            {countdown.hours}
                                        </Text>
                                        <Text size="xs" c="dimmed" ta="center">
                                            Horas
                                        </Text>
                                    </Card>

                                    <Card withBorder padding="sm" radius="md">
                                        <Text fw={700} ta="center">
                                            {countdown.minutes}
                                        </Text>
                                        <Text size="xs" c="dimmed" ta="center">
                                            Min
                                        </Text>
                                    </Card>

                                    <Card withBorder padding="sm" radius="md">
                                        <Text fw={700} ta="center">
                                            {countdown.seconds}
                                        </Text>
                                        <Text size="xs" c="dimmed" ta="center">
                                            Seg
                                        </Text>
                                    </Card>
                                </SimpleGrid>
                            </>
                        )}
                        </>
                    ) : (
                        <Text c="dimmed" mt="sm">
                            No hay próximos partidos de Argentina disponibles.
                        </Text>
                    )}
                </Card>

                <Card withBorder radius="md" padding="lg">
                    <Title order={3}>Partidos de hoy</Title>

                    {todayMatches.length > 0 ? (
                        <Stack mt="md" gap="sm">
                            {todayMatches.map((match) => (
                                <Group key={match._id} justify="space-between" align="flex-start">
                                    <Box>
                                        <Group gap={6} align="center" wrap="wrap">
                                            <Group gap={4} align="center" wrap="nowrap">
                                                {getTeamFlagUrl(match.homeTeam) && <img src={getTeamFlagUrl(match.homeTeam)} alt={match.homeTeam} width={24} height={16} style={{ objectFit: "cover", border: "1px solid #dee2e6", borderRadius: 2 }} />}
                                                <Text fw={500}>{match.homeTeam}</Text>
                                            </Group>
                                            <Text c="dimmed" size="sm">vs</Text>
                                            <Group gap={4} align="center" wrap="nowrap">
                                                {getTeamFlagUrl(match.awayTeam) && <img src={getTeamFlagUrl(match.awayTeam)} alt={match.awayTeam} width={24} height={16} style={{ objectFit: "cover", border: "1px solid #dee2e6", borderRadius: 2 }} />}
                                                <Text fw={500}>{match.awayTeam}</Text>
                                            </Group>
                                        </Group>

                                        <Text size="xs" c="dimmed">
                                            {new Date(match.startDate).toLocaleString("es-AR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </Text>

                                        <Badge
                                            hiddenFrom="sm"
                                            mt="xs"
                                            variant="light"
                                        >
                                            {match.group}
                                        </Badge>
                                    </Box>

                                    <Badge
                                        visibleFrom="sm"
                                        variant="light"
                                    >
                                        {match.group}
                                    </Badge>
                                </Group>
                            ))}
                        </Stack>
                    ) : (
                        <>
                            <Text c="dimmed" mt="sm">
                                No hay partidos programados para hoy.
                            </Text>

                            <Text fw={700} mt="md">
                                Próximos partidos
                            </Text>

                            <Stack mt="sm" gap="xs">
                                {upcomingMatches.map((match) => (
                                    <Group key={match._id} justify="space-between" align="flex-start">
                                    <Box>
                                        <Group gap={6} align="center" wrap="wrap">
                                            <Group gap={4} align="center" wrap="nowrap">
                                                {getTeamFlagUrl(match.homeTeam) && <img src={getTeamFlagUrl(match.homeTeam)} alt={match.homeTeam} width={24} height={16} style={{ objectFit: "cover", border: "1px solid #dee2e6", borderRadius: 2 }} />}
                                                <Text fw={500}>{match.homeTeam}</Text>
                                            </Group>
                                            <Text c="dimmed" size="sm">vs</Text>
                                            <Group gap={4} align="center" wrap="nowrap">
                                                {getTeamFlagUrl(match.awayTeam) && <img src={getTeamFlagUrl(match.awayTeam)} alt={match.awayTeam} width={24} height={16} style={{ objectFit: "cover", border: "1px solid #dee2e6", borderRadius: 2 }} />}
                                                <Text fw={500}>{match.awayTeam}</Text>
                                            </Group>
                                        </Group>

                                        <Text size="xs" c="dimmed">
                                            {new Date(match.startDate).toLocaleString("es-AR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </Text>

                                        <Badge
                                            hiddenFrom="sm"
                                            mt="xs"
                                            variant="light"
                                        >
                                            {match.group}
                                        </Badge>
                                    </Box>

                                    <Badge
                                        visibleFrom="sm"
                                        variant="light"
                                    >
                                        {match.group}
                                    </Badge>
                                </Group>
                                ))}
                            </Stack>
                        </>
                    )}
                </Card>
            </SimpleGrid>
        </Stack>
    );
};

export default DashboardPage;