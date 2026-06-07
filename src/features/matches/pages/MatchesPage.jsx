import { useEffect, useState } from "react";
import { Center, Loader, Stack, Text, Title, SegmentedControl, Select, Pagination } from "@mantine/core";

import { getMatchesWithPredictionsRequest } from "../services/matches.service";
import MatchCard from "../components/MatchCard";

const MatchesPage = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [journeyFilter, setJourneyFilter] = useState("all");
    const [activePage, setActivePage] = useState(1);

    const matchesPerPage = 10;

    useEffect(() => {
        const loadMatches = async () => {
            try {
                const data = await getMatchesWithPredictionsRequest();
                setMatches(data.matches);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        loadMatches();
    }, []);

    useEffect(() => {
        setActivePage(1);
    }, [statusFilter, journeyFilter]);

    if (loading) {
        return (
            <Center h={300}>
                <Loader size="lg" />
            </Center>
        );
    }

    const journeyOptions = [
        { label: "Todas las jornadas", value: "all" },
        { label: "Jornada 1", value: "matchday-1" },
        { label: "Jornada 2", value: "matchday-2" },
        { label: "Jornada 3", value: "matchday-3" },
        { label: "Eliminatorias", value: "knockout" }
    ];

    const filteredMatches = matches.filter((match) => {
        const matchesStatus = (() => {
            if (statusFilter === "all") return true;

            if (statusFilter === "pending") {
                return !match.prediction && !match.predictionClosed;
            }

            if (statusFilter === "predicted") {
                return match.prediction && !match.predictionClosed;
            }

            if (statusFilter === "closed") {
                return match.predictionClosed;
            }

            return true;
        })();

        const matchesJourney = (() => {
            if (journeyFilter === "all") return true;

            if (journeyFilter === "matchday-1") {
                return match.stage === "GROUP_STAGE" && match.matchday === 1;
            }

            if (journeyFilter === "matchday-2") {
                return match.stage === "GROUP_STAGE" && match.matchday === 2;
            }

            if (journeyFilter === "matchday-3") {
                return match.stage === "GROUP_STAGE" && match.matchday === 3;
            }

            if (journeyFilter === "knockout") {
                return match.stage !== "GROUP_STAGE";
            }

            return true;
        })();

        return matchesStatus && matchesJourney;
    });

      const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);

      const paginatedMatches = filteredMatches.slice(
          (activePage - 1) * matchesPerPage,
          activePage * matchesPerPage
      );

    return (
      <Stack>

          <Title order={1}>
              Partidos y predicciones
          </Title>

          <Text c="dimmed">
              {matches.length} partidos encontrados
          </Text>

          <SegmentedControl
                visibleFrom="sm"
                value={statusFilter}
                onChange={setStatusFilter}
                data={[
                    { label: "Todos", value: "all" },
                    { label: "Pendientes", value: "pending" },
                    { label: "Pronosticados", value: "predicted" },
                    { label: "Cerrados", value: "closed" }
                ]}
            />

            <Select
                hiddenFrom="sm"
                label="Filtrar por estado"
                value={statusFilter}
                onChange={setStatusFilter}
                data={[
                    { label: "Todos", value: "all" },
                    { label: "Pendientes", value: "pending" },
                    { label: "Pronosticados", value: "predicted" },
                    { label: "Cerrados", value: "closed" }
                ]}
            />

            <Select
                label="Filtrar por jornada"
                value={journeyFilter}
                onChange={setJourneyFilter}
                data={journeyOptions}
                w={260}
            />

          {paginatedMatches.map((match) => (
              <MatchCard
                  key={match._id}
                  match={match}
              />
          ))}

          {totalPages > 1 && (
              <Pagination
                hiddenFrom="sm"
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