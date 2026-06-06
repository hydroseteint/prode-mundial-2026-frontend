import { useEffect, useState } from "react";
import { Center, Loader, Stack, Text, Title, SegmentedControl, Select, Pagination } from "@mantine/core";

import { getMatchesWithPredictionsRequest } from "../services/matches.service";
import MatchCard from "../components/MatchCard";

const MatchesPage = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [groupFilter, setGroupFilter] = useState("all");
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
      }, [statusFilter, groupFilter]);

    if (loading) {
        return (
            <Center h={300}>
                <Loader size="lg" />
            </Center>
        );
    }

    const groupOptions = [
          { label: "Todos los grupos", value: "all" },
          ...Array.from(new Set(matches.map((match) => match.group)))
              .filter(Boolean)
              .map((group) => ({
                  label: group.replace("GROUP_", "Grupo "),
                  value: group
              }))
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

          const matchesGroup =
              groupFilter === "all" || match.group === groupFilter;

          return matchesStatus && matchesGroup;
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
              label="Filtrar por grupo"
              value={groupFilter}
              onChange={setGroupFilter}
              data={groupOptions}
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