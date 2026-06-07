import { useEffect, useState } from "react";
import { Center, Loader, Stack, Text, Title, SegmentedControl, Select, Pagination } from "@mantine/core";

import { getMatchesWithPredictionsRequest } from "../services/matches.service";
import MatchCard from "../components/MatchCard";

const journeyOptions = [
    { label: "Todas las jornadas", value: "all" },
    { label: "Jornada 1", value: "matchday-1" },
    { label: "Jornada 2", value: "matchday-2" },
    { label: "Jornada 3", value: "matchday-3" },
    { label: "Eliminatorias", value: "knockout" },
];

const MatchesPage = () => {
    const [matches, setMatches] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [journeyFilter, setJourneyFilter] = useState("all");
    const [activePage, setActivePage] = useState(1);

    useEffect(() => {
        const loadMatches = async () => {
            setLoading(true);
            try {
                const data = await getMatchesWithPredictionsRequest({
                    page: activePage,
                    status: statusFilter,
                    journey: journeyFilter,
                });
                setMatches(data.matches);
                setTotal(data.total);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        loadMatches();
    }, [activePage, statusFilter, journeyFilter]);

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setActivePage(1);
    };

    const handleJourneyChange = (value) => {
        setJourneyFilter(value);
        setActivePage(1);
    };

    return (
        <Stack>
            <Title order={1}>Partidos y predicciones</Title>

            <Text c="dimmed">{total} partidos encontrados</Text>

            <SegmentedControl
                visibleFrom="sm"
                value={statusFilter}
                onChange={handleStatusChange}
                data={[
                    { label: "Todos", value: "all" },
                    { label: "Pendientes", value: "pending" },
                    { label: "Pronosticados", value: "predicted" },
                    { label: "Cerrados", value: "closed" },
                ]}
            />

            <Select
                hiddenFrom="sm"
                label="Filtrar por estado"
                value={statusFilter}
                onChange={handleStatusChange}
                data={[
                    { label: "Todos", value: "all" },
                    { label: "Pendientes", value: "pending" },
                    { label: "Pronosticados", value: "predicted" },
                    { label: "Cerrados", value: "closed" },
                ]}
            />

            <Select
                label="Filtrar por jornada"
                value={journeyFilter}
                onChange={handleJourneyChange}
                data={journeyOptions}
                w={260}
            />

            {loading ? (
                <Center h={300}>
                    <Loader size="lg" />
                </Center>
            ) : (
                matches.map((match) => (
                    <MatchCard key={match._id} match={match} />
                ))
            )}

            {totalPages > 1 && (
                <Pagination
                    size="md"
                    siblings={0}
                    boundaries={1}
                    total={totalPages}
                    value={activePage}
                    onChange={setActivePage}
                />
            )}
        </Stack>
    );
};

export default MatchesPage;