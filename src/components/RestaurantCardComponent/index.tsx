import React from "react";

import Image from "next/image";

import { Badge, Box, Button, Flex, Grid, Rating, Stack, Text } from "@mantine/core";

import HamburgerImage from "./../../../public/assets/hamburger.jpg";
import { IconClick } from "@tabler/icons-react";
import Link from "next/link";

interface RestaurantCardComponentProps {
    id: string;
    created_at: Date;
    updated_at: Date;
    name: string;
    location: string | null;
    phone_number: string | null;
    enabled: boolean;
    number_of_reviews: number | null;
}

export default function RestaurantCardComponent(props: RestaurantCardComponentProps) {
    const rating = Math.floor(Math.random() * (5 - 3 + 1)) + 3;

    return (
        <Grid.Col span={4}>
            <Box
                w={"100%"}
                h={"28rem"}
                bg={"gray"}
                style={{
                    position: "relative",
                    borderRadius: "8px",
                }}
            >
                <Image
                    src={HamburgerImage}
                    alt="Somewhere in Paris..."
                    priority
                    fill
                    sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                    style={{
                        position: "absolute",
                        borderRadius: "8px",
                        objectFit: "cover",
                        objectPosition: "center",
                        zIndex: 10,
                    }}
                />
                <Grid
                    w={"100%"}
                    h={"100%"}
                    p={10}
                    pos={"relative"}
                    top={0}
                    left={0}
                    style={{ zIndex: 20 }}
                >
                    <Grid.Col
                        span={'auto'}
                        pos={'absolute'}
                        top={0}
                        left={0}
                    >
                        <Badge color="red" size={'lg'}>ร้านอาหาร</Badge>
                    </Grid.Col>
                    <Grid.Col
                        span={12}
                        pos={'absolute'}
                        bottom={0}
                        left={0}
                        style={{
                            width: '100%',
                            height: '50px',
                            color: '#ffffff',
                            backgroundColor: 'rgba(39, 39, 39, 0.1)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            borderRadius: '0px 0px 8px 8px'
                        }}
                    >
                        <Flex
                            w={'100%'}
                            h={'100%'}
                            direction={'row'}
                            justify={'space-between'}
                            align={'center'}
                            wrap={'nowrap'}
                        >
                            <Stack gap={0}>
                                <Text fw={700} fz={'xs'} truncate={'end'}>
                                    {props.name}
                                </Text>
                                <Rating defaultValue={rating} size="xs" readOnly />
                            </Stack>
                            <Button
                                component={Link}
                                size={'xs'}
                                radius={'md'}
                                leftSection={<IconClick size={16} />}
                                href={`/restaurants/${props.id}`}
                            >
                                รายละเอียด
                            </Button>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Box>
        </Grid.Col>
    );
}
