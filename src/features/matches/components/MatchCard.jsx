import { useState } from "react";
import {
    Badge,
    Button,
    Card,
    Group,
    NumberInput,
    Stack,
    Text,
    Title
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { getTeamFlagUrl } from "../../../shared/utils/team.utils";
import { savePredictionRequest } from "../services/matches.service";

const MatchCard = ({ match }) => {
    const [predictedHomeGoals, setPredictedHomeGoals] = useState(
        match.prediction?.predictedHomeGoals ?? 0
    );

    const [predictedAwayGoals, setPredictedAwayGoals] = useState(
        match.prediction?.predictedAwayGoals ?? 0
    );

    const [saving, setSaving] = useState(false);

    const [currentPrediction, setCurrentPrediction] = useState(match.prediction);

    const getPredictionStatus = () => {
        if (match.predictionClosed) {
            return {
                label: "Cerrado",
                color: "red"
            };
        }

        if (currentPrediction) {
            return {
                label: "Pronosticado",
                color: "green"
            };
        }

        return {
            label: "Pendiente",
            color: "blue"
        };
    };

    const handleSavePrediction = async () => {
        try {
            const data = await savePredictionRequest({
                matchId: match._id,
                predictedHomeGoals,
                predictedAwayGoals
            });

            setCurrentPrediction(data.prediction);

            notifications.show({
                title: "Pronóstico guardado",
                message: "Tu predicción se guardó correctamente",
                color: "green"
            });

        } catch (error) {
            notifications.show({
                title: "Error",
                message: error.response?.data?.message || "No se pudo guardar el pronóstico",
                color: "red"
            });

        } finally {
            setSaving(false);
        }
    };

    const predictionStatus = getPredictionStatus();

    return (
        <Card withBorder radius="md" padding="lg">

            <Group justify="space-between" align="center">
                <Badge variant="light">
                    {match.group}
                </Badge>

                <Badge color={predictionStatus.color} variant="light">
                    {predictionStatus.label}
                </Badge>
            </Group>

            {/* Desktop */}
            <Group visibleFrom="sm" justify="center" align="center" mt="lg">
                <Stack align="center" gap="xs" style={{ flex: 1 }}>
                    {getTeamFlagUrl(match.homeTeam) && <img src={getTeamFlagUrl(match.homeTeam)} alt={match.homeTeam} width={40} height={27} style={{ objectFit: "cover", border: "1px solid #dee2e6", borderRadius: 2 }} />}
                    <Title order={4} ta="center">{match.homeTeam}</Title>

                    <NumberInput
                        value={predictedHomeGoals}
                        onChange={setPredictedHomeGoals}
                        min={0}
                        max={20}
                        w={100}
                        disabled={match.predictionClosed}
                    />
                </Stack>

                <Stack align="center" gap="xs">
                    <Text fw={900} size="xl">VS</Text>
                    <Text size="sm" c="dimmed">
                        {new Date(match.startDate).toLocaleString("es-AR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </Text>
                </Stack>

                <Stack align="center" gap="xs" style={{ flex: 1 }}>
                    {getTeamFlagUrl(match.awayTeam) && <img src={getTeamFlagUrl(match.awayTeam)} alt={match.awayTeam} width={40} height={27} style={{ objectFit: "cover", border: "1px solid #dee2e6", borderRadius: 2 }} />}
                    <Title order={4} ta="center">{match.awayTeam}</Title>

                    <NumberInput
                        value={predictedAwayGoals}
                        onChange={setPredictedAwayGoals}
                        min={0}
                        max={20}
                        w={100}
                        disabled={match.predictionClosed}
                    />
                </Stack>
            </Group>

            {/* Mobile */}
            <Stack hiddenFrom="sm" align="center" mt="md" gap="sm">
                <Stack align="center" gap="xs">
                    {getTeamFlagUrl(match.homeTeam) && <img src={getTeamFlagUrl(match.homeTeam)} alt={match.homeTeam} width={40} height={27} style={{ objectFit: "cover", border: "1px solid #dee2e6", borderRadius: 2 }} />}
                    <Title order={4} ta="center">{match.homeTeam}</Title>

                    <NumberInput
                        value={predictedHomeGoals}
                        onChange={setPredictedHomeGoals}
                        min={0}
                        max={20}
                        w={120}
                        disabled={match.predictionClosed}
                    />
                </Stack>

                <Text fw={900} size="xl">VS</Text>

                <Stack align="center" gap={4}>
                    {getTeamFlagUrl(match.awayTeam) && <img src={getTeamFlagUrl(match.awayTeam)} alt={match.awayTeam} width={40} height={27} style={{ objectFit: "cover", border: "1px solid #dee2e6", borderRadius: 2 }} />}
                    <Title order={4} ta="center">{match.awayTeam}</Title>

                    <NumberInput
                        value={predictedAwayGoals}
                        onChange={setPredictedAwayGoals}
                        min={0}
                        max={20}
                        w={120}
                        disabled={match.predictionClosed}
                    />
                </Stack>

                <Text size="sm" c="dimmed" ta="center">
                    {new Date(match.startDate).toLocaleString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </Text>
            </Stack>

            <Button
                mt="lg"
                disabled={match.predictionClosed}
                loading={saving}
                onClick={handleSavePrediction}
            >
                Guardar resultado
            </Button>
        </Card>
    );
};

export default MatchCard;