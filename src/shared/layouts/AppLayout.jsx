import { AppShell, NavLink, Group, Text, Box, Image, Burger } from "@mantine/core"
import {IconHome, IconBallFootball, IconTrophy, IconFileText, IconUser, IconLogout, IconUsers } from "@tabler/icons-react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useDisclosure } from "@mantine/hooks";

import { useAuth } from "../../app/providers/AuthProvider";
import logo from "../../assets/Logo-hydro.jpg"

const AppLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [opened, { toggle }] = useDisclosure();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const navItems = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: IconHome
        },
        {
            label: "Partidos",
            path: "/matches",
            icon: IconBallFootball
        },
        {
            label: "Ranking",
            path: "/leaderboard",
            icon: IconTrophy
        },
        {
            label: "Reglas y premios",
            path: "/rules",
            icon: IconFileText
        },
        {
            label: "Mi perfil",
            path: "/profile",
            icon: IconUser
        },
        ...(user?.role === "admin"
            ? [
                {
                    label: "Usuarios",
                    path: "/users",
                    icon: IconUsers
                }
            ]
            : [])
    ];

    return (
        <AppShell padding="md" navbar={{ width: 260, breakpoint: "sm", collapsed: { mobile: !opened }}}>
            
            <AppShell.Navbar p="md">
                <Box mb="xl">
                    <Text fw={700} size="lg">Prode Mundial 2026</Text>
                    <Text size="lg" c="dimmed">Competencia interna</Text>
                    <Box>
                        <Image src={logo}
                            alt="Hydro Seteint"
                            mt="lg"
                            w={140}
                            mx="auto" style={{opacity:0.9}} />
                    </Box>
                </Box>

                

                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            label={item.label}
                            leftSection={<Icon size={20} />}
                            active={location.pathname === item.path}
                            onClick={() => {
                                navigate(item.path);

                                if (opened) {
                                    toggle();
                                }
                            }}
                            mb="xs"
                        />
                    )
                })}

                <NavLink
                    label="Cerrar sesión"
                    leftSection={<IconLogout size={20} />}
                    color="red"
                    onClick={handleLogout}
                    mt="auto"
                />
            </AppShell.Navbar>

            <AppShell.Main style={{paddingTop: "var(--mantine-spacing-md)"}}>
                <Group hiddenFrom="sm" mb="md">
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        size="sm"
                    />

                    <Text fw={700}>
                        Prode Mundial 2026
                    </Text>
                </Group>
                <Outlet />
            </AppShell.Main>

        </AppShell>
    )

}

export default AppLayout