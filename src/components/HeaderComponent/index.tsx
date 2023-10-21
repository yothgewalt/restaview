import React from "react";

import Image from "next/image";
import Link from "next/link";

import { signIn, signOut, useSession } from "next-auth/react";

import {
    Badge,
    Button,
    Container,
    Grid,
    Group,
    Text,
    UnstyledButton,
} from "@mantine/core";

import SaladServeImage from "./../../../public/assets/salad_serve.svg";

import { IconUser } from "@tabler/icons-react";
import { Roles } from "@prisma/client";

export default function HeaderComponent() {
    const { data: sessionData } = useSession();
    const userIcon = <IconUser size={14} />;

    return (
        <header
            className="w-full bg-white"
            style={{
                borderBottom: "1px solid #dee2e6",
            }}
        >
            <Container>
                <Grid
                    justify={"space-between"}
                    align={"center"}
                    grow
                    gutter={0}
                >
                    <Grid.Col span={6}>
                        <UnstyledButton component={Link} href={"/"}>
                            <Group gap={"xs"}>
                                <Image
                                    src={SaladServeImage}
                                    alt="salad"
                                    width={64}
                                    height={64}
                                />
                                <Text fw={700} size={"xl"} c={"orange.6"}>
                                    Restaview
                                </Text>
                            </Group>
                        </UnstyledButton>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Group justify="flex-end">
                            <Group gap={'xs'}>
                                {sessionData && (
                                    <Badge
                                        size={"xs"}
                                        radius={"sm"}
                                        color={
                                            sessionData?.user.role == Roles.USER
                                                ? "blue"
                                                : "red"
                                        }
                                    >
                                        {sessionData?.user.role}
                                    </Badge>
                                )}
                                <Link
                                    href={
                                        sessionData
                                            ? "/auth/profile"
                                            : "/auth/signup"
                                    }
                                    className="text-sm text-[#228be6] transition hover:text-[#385b7a]"
                                >
                                    {sessionData
                                        ? sessionData.user?.email_address
                                        : "คุณยังไม่มีบัญชี?"}
                                </Link>
                            </Group>
                            <Button
                                variant={"filled"}
                                size={"xs"}
                                radius={"md"}
                                leftSection={userIcon}
                                onClick={
                                    sessionData
                                        ? () => void signOut()
                                        : () => void signIn()
                                }
                            >
                                {sessionData ? "ล็อกเอ้าท์" : "ล็อกอิน"}
                            </Button>
                        </Group>
                    </Grid.Col>
                </Grid>
            </Container>
        </header>
    );
}
