import React from "react";

import Image from "next/image";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";

import { Box, Container, Flex, Grid, Group, Stack, Text, TextInput, UnstyledButton } from "@mantine/core";

import { IconAt, IconPackage } from "@tabler/icons-react";

import PersonImage from './../../../public/assets/person.jpg';
import SteakVectorImage from "./../../../public/assets/steak.svg";
import WomanServeVectorImage from "./../../../public/assets/woman_serve.svg";

export default function Profile() {
    const router = useRouter();
    const { data: sessionData } = useSession();

    React.useEffect(() => {
        void (async () => {
            if (!sessionData?.user) {
                return await router.push("/");
            }
        })();
    }, [router, sessionData?.user]);

    return (
        <div className="h-auto w-full bg-[#edf0f2] py-8">
            <Container
                w={"100%"}
                p={16}
                style={{
                    borderRadius: "8px",
                    background: "#ffffff",
                }}
            >
                <Grid grow gutter={0}>
                    <Grid.Col
                        span={4}
                        style={{
                            height: "512px",
                            position: "relative",
                        }}
                    >
                        <Image
                            src={PersonImage}
                            alt="A hero image for restaview website."
                            priority
                            fill
                            style={{
                                position: "absolute",
                                objectFit: "cover",
                                borderRadius: "12px",
                                objectPosition: "center",
                                zIndex: 10,
                            }}
                        />
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <Stack ml={64}>
                            <Group justify={'space-evenly'}>
                                <TextInput
                                    variant={'filled'}
                                    label={'อีเมลของคุณ'}
                                    description={'อีเมลที่ใช้งานบนเว็บไซต์ของเรา'}
                                    value={sessionData?.user.email_address}
                                    leftSection={<IconAt size={14} />}
                                    readOnly
                                />
                                <TextInput
                                    variant={'filled'}
                                    label={'บทบาทของคุณ'}
                                    description={'บทบาทที่คุณใช้งานบนเว็บไซต์'}
                                    value={sessionData?.user.role}
                                    leftSection={<IconPackage size={14} />}
                                    readOnly
                                />
                            </Group>
                        </Stack>
                        <Flex
                            w={"100%"}
                            h={"100%"}
                            direction={"column"}
                            gap={"xl"}
                            justify={"center"}
                            align={"center"}
                        >
                            <Stack align="center" gap={0}>
                                <Text fz={"lg"} fw={700}>
                                    ค้นหาสิ่งที่น่าสนใจ
                                </Text>
                                <Text fw={400} c={"gray.6"}>
                                    ทางลัดสู่หน้าที่มีข้อมูลที่อาจเป็นประโยชน์
                                </Text>
                            </Stack>
                            <Box h={48}>
                            <Flex
                                w={"100%"}
                                h={"100%"}
                                direction={"row"}
                                justify={"center"}
                                align={"center"}
                                wrap={"wrap"}
                                gap={80}
                            >
                                <UnstyledButton>
                                    <Stack
                                        justify="center"
                                        align="center"
                                        gap={"xs"}
                                    >
                                        <Image
                                            src={SteakVectorImage}
                                            alt="Bento"
                                            width={64}
                                            height={64}
                                        />
                                        <Text fw={700} fz={"xs"}>
                                            ร้านอาหาร
                                        </Text>
                                    </Stack>
                                </UnstyledButton>
                                <UnstyledButton>
                                    <Stack
                                        justify="center"
                                        align="center"
                                        gap={"xs"}
                                    >
                                        <Image
                                            src={WomanServeVectorImage}
                                            alt="Bento"
                                            width={64}
                                            height={64}
                                        />
                                        <Text fw={700} fz={"xs"}>
                                            ริวิวอาหาร
                                        </Text>
                                    </Stack>
                                </UnstyledButton>
                            </Flex>
                            </Box>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Container>
        </div>
    );
}
