import {
    Card,
    List,
    Stack,
    Text,
    Title
} from "@mantine/core";

const RulesPage = () => {
    return (
        <Stack>
            <div>
                <Title order={1}>Reglas y premios</Title>

                <Text c="dimmed">
                    Información general del Prode Mundial 2026.
                </Text>
            </div>

            <Card withBorder radius="md" padding="lg">
                <Title order={3}>🎯 Sistema de puntuación</Title>

                <Text mt="md">
                    Resultado exacto: <strong>3 puntos</strong>
                </Text>

                <Text>
                    Ganador correcto o empate correcto: <strong>1 punto</strong>
                </Text>

                <Text>
                    Pronóstico incorrecto: <strong>0 puntos</strong>
                </Text>
            </Card>

            <Card withBorder radius="md" padding="lg">
                <Title order={3}>🏆 Premios por fecha - Fase de grupos</Title>

                <Text mt="md">
                    En cada una de las 3 fechas de la fase de grupos habrá dos premios:
                </Text>

                <List mt="md" spacing="sm">
                    <List.Item>
                        Participante con más puntos en la fecha.
                    </List.Item>

                    <List.Item>
                        Participante con más resultados exactos acertados en la fecha.
                    </List.Item>
                </List>

                <Text mt="md" c="dimmed">
                    Esto aplica para la fecha 1, fecha 2 y fecha 3 de la fase de grupos.
                </Text>
            </Card>

            <Card withBorder radius="md" padding="lg">
                <Title order={3}>🥇 Premios finales</Title>

                <Text mt="md">
                    Al finalizar todo el Prode se premiará a los 3 participantes con mayor puntaje total.
                </Text>

                <List mt="md" spacing="sm">
                    <List.Item>🥇 Primer puesto</List.Item>
                    <List.Item>🥈 Segundo puesto</List.Item>
                    <List.Item>🥉 Tercer puesto</List.Item>
                </List>

                <Text mt="md">
                    En caso de empate, la posición se definirá por la mayor cantidad de resultados exactos acertados.
                </Text>
            </Card>

            <Card withBorder radius="md" padding="lg">
                <Title order={3}>ℹ️ Información importante</Title>

                <Text mt="md">
                    Los pronósticos podrán modificarse hasta el inicio de cada partido.
                </Text>

                <Text>
                    Una vez comenzado el encuentro, el pronóstico quedará bloqueado.
                </Text>

                <Text>
                    El ranking se actualizará automáticamente cuando se registren los resultados oficiales.
                </Text>
            </Card>
        </Stack>
    );
};

export default RulesPage;