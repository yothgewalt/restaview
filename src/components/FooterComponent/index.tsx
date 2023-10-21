import React from "react";

import Link from "next/link";
import Image from "next/image";

import { Container, Grid, Group, UnstyledButton, Text } from "@mantine/core";

import SaladServeImage from "./../../../public/assets/salad_serve.svg";

type FooterLink = {
    id: number;
    label: string;
    href: string;
};

const links: FooterLink[] = [
    {
        id: 1,
        label: 'รีวิว',
        href: '/'
    },
    {
        id: 2,
        label: 'ร้านอาหาร',
        href: '/'
    },
    {
        id: 3,
        label: 'โปรไฟล์ของคุณ',
        href: '/'
    }
];

export default function FooterComponent() {
    return (
        <footer
            className="h-16 w-full relative bg-[#edf0f2]"
            style={{
                borderTop: '2px solid #dee2e6'
            }}
        >
            <Container>
                <Grid justify={"space-between"} align={"center"}>
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
                        <Group justify={'flex-end'}>
                            {links.map((item) => {
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={'text-black transition hover:text-neutral-500'}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </Group>
                    </Grid.Col>
                </Grid>
            </Container>
        </footer>
    );
}
