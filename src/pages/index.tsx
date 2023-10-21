import React from "react";

import {
    Box,
    Container,
    Text,
    Tabs,
    rem,
    Stack,
    Flex,
    UnstyledButton,
    Grid,
    Group,
    Button,
    Modal,
    TextInput,
    Textarea,
    PinInput,
    Avatar,
    Badge,
    Rating,
} from "@mantine/core";

import {
    IconMessageCircle,
    IconStarFilled,
    IconComet,
    IconAt,
    IconChefHat,
} from "@tabler/icons-react";

import Image from "next/image";

import RibeyesImage from "./../../public/assets/ribeyes.jpg";

import SteakVectorImage from "./../../public/assets/steak.svg";
import WomanServeVectorImage from "./../../public/assets/woman_serve.svg";
import { api } from "@restaview/utils/api";
import { RestaurantCardComponent } from "@restaview/components";
import { useDisclosure } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { Roles } from "@prisma/client";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import Link from "next/link";

type RestaurantPayload = {
    name: string;
    location: string;
    phone_number: string;
};

export default function Home() {
    const router = useRouter();
    const { data: sessionData } = useSession();

    const iconStyle = { width: rem(12), height: rem(12) };

    const rating = Math.floor(Math.random() * (5 - 3 + 1)) + 3;

    const [opened, { open, close }] = useDisclosure(false);
    const [isCreatingRestaurant, setIsCreatingRestaurant] =
        React.useState<boolean>(false);
    const CreateOneRestaurant =
        api.restaurant.createOneRestaurant.useMutation();
    const CreateRestaurantForm = useForm({
        initialValues: {
            name: "",
            location: "",
            phone_number: "",
        },

        validate: {
            name: (value) => {
                if (value.length < 2) {
                    return "ชื่อร้านอาหารไม่มีทางที่จะต่ำกว่า 2 ตัวอักษรได้";
                }
            },
            location: (value) => {
                if (value.length < 16) {
                    return "ที่อยู่ไม่มีทางที่จะต่ำกว่า 16 ตัวอักษรได้";
                }
            },
            phone_number: (value) => {
                if (value.length !== 10) {
                    return "รูปแบบเบอร์โทรศัพท์ต้องมีทั้งหมด 10 ตัวเลข";
                }
            },
        },
    });

    const OnCreateRestaurantSubmitEvent = async (values: RestaurantPayload) => {
        setIsCreatingRestaurant(true);

        await CreateOneRestaurant.mutateAsync({
            name: values.name,
            location: values.location,
            phone_number: values.phone_number,
        })
            .then((response) => {
                if (response instanceof Error) {
                    setIsCreatingRestaurant(false);
                    return notifications.show({
                        color: "red",
                        title: "เกิดข้อผิดพลาด",
                        message: response.message,
                    });
                } else {
                    notifications.show({
                        color: "green",
                        title: "สร้างร้านอาหารสำเร็จ",
                        message: `คุณได้ทำการสร้างอาหารชื่อ ${values.name} แล้ว`,
                    });
                    setIsCreatingRestaurant(false);

                    close();
                    return router.reload();
                }
            })
            .catch((error) => {
                setIsCreatingRestaurant(false);
                return (
                    notifications.show({
                        color: "red",
                        title: "เกิดข้อผิดพลาด",
                        message: error,
                    }) && close()
                );
            });
    };

    const getLatestRestaurants = api.restaurant.getLatestRestaurants.useQuery();

    const getRecommendedRestaurants = api.restaurant.getRecommendedRestaurants.useQuery();

    const getLatestReviews = api.review.getLatestReviews.useQuery();

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title={"สร้างร้านอาหาร"}
                centered
            >
                <Box
                    component={"form"}
                    onSubmit={CreateRestaurantForm.onSubmit((values) => {
                        return void OnCreateRestaurantSubmitEvent(values);
                    })}
                >
                    <Stack>
                        <TextInput
                            label={"ชื่อร้านอาหาร"}
                            withAsterisk
                            description={"ชื่อที่ถูกนำไปแสดงบนเว็บไซต์ของเรา"}
                            placeholder={"ร้านอาหาร"}
                            leftSection={
                                <IconChefHat
                                    style={{ width: rem(14), height: rem(14) }}
                                />
                            }
                            {...CreateRestaurantForm.getInputProps("name")}
                        />
                        <Textarea
                            label={"ที่อยู่ของร้านอาหาร"}
                            description={
                                "ที่อยู่ที่แสดงจะเป็นตัวบอกตำแหน่งของร้าน"
                            }
                            withAsterisk
                            leftSection={
                                <IconAt
                                    style={{ width: rem(14), height: rem(14) }}
                                />
                            }
                            autosize
                            {...CreateRestaurantForm.getInputProps("location")}
                        />
                        <Stack>
                            <Stack gap={0}>
                                <Text fz={14}>เบอร์โทรศัพท์ติดต่อ</Text>
                                <Text fz={13} c={"gray.6"}>
                                    เบอร์โทรศัพท์ไว้ติดต่อสอบถามเกี่ยวกับร้าน
                                </Text>
                            </Stack>
                            <PinInput
                                length={10}
                                {...CreateRestaurantForm.getInputProps(
                                    "phone_number",
                                )}
                            />
                        </Stack>
                    </Stack>
                    <Button
                        loading={isCreatingRestaurant}
                        mt={"xl"}
                        w={"100%"}
                        type={"submit"}
                    >
                        สร้างร้านอาหาร
                    </Button>
                </Box>
            </Modal>

            <main className="h-auto w-full overflow-hidden">
                <div className="relative h-[24rem] w-full overflow-hidden bg-neutral-300">
                    <Image
                        src={RibeyesImage}
                        alt="A hero image for restaview website."
                        priority
                        fill
                        style={{
                            position: "absolute",
                            objectFit: "cover",
                            objectPosition: "center",
                            zIndex: 10,
                        }}
                    />
                </div>
                <div className="w-full bg-white py-5">
                    <Container w={"100%"} h={"100%"}>
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
                        </Flex>
                    </Container>
                </div>
                <div className="h-auto w-full bg-[#edf0f2] py-8">
                    <Container>
                        <Box
                            style={{
                                width: "100%",
                                height: "100%",
                                padding: "16px",
                                borderRadius: "8px",
                                background: "#ffffff",
                            }}
                        >
                            <Stack>
                                <Group justify={"space-between"}>
                                    <Text fz={14} fw={700}>
                                        แนะนำสำหรับคุณ
                                    </Text>
                                    {sessionData?.user.role ==
                                        Roles.ADMINISTRATOR && (
                                        <Button onClick={open}>
                                            สร้างร้านอาหาร
                                        </Button>
                                    )}
                                </Group>

                                <Tabs defaultValue="reviews">
                                    <Stack>
                                        <Tabs.List>
                                            <Tabs.Tab
                                                value="reviews"
                                                leftSection={
                                                    <IconMessageCircle
                                                        style={iconStyle}
                                                    />
                                                }
                                            >
                                                รีวิวล่าสุด
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                value="restaurant-recommended"
                                                leftSection={
                                                    <IconStarFilled
                                                        style={iconStyle}
                                                    />
                                                }
                                            >
                                                ร้านอาหารยอดนิยม
                                            </Tabs.Tab>
                                            <Tabs.Tab
                                                value="new-restaurant"
                                                leftSection={
                                                    <IconComet
                                                        style={iconStyle}
                                                    />
                                                }
                                            >
                                                ร้านอาหารใหม่
                                            </Tabs.Tab>
                                        </Tabs.List>

                                        <Tabs.Panel value="reviews">
                                            <Stack>
                                                {getLatestReviews.data?.reviews.map(
                                                    (item, index) => {
                                                        return (
                                                            <Box
                                                                w={"100%"}
                                                                h={"auto"}
                                                                key={index}
                                                                component={Link}
                                                                href={`/restaurants/${item.restaurant_id}`}
                                                            >
                                                                <Box
                                                                    p={12}
                                                                    style={{
                                                                        borderRadius:
                                                                            "8px",
                                                                    }}
                                                                    bg={
                                                                        "gray.1"
                                                                    }
                                                                >
                                                                    <Stack>
                                                                        <Group
                                                                            justify={
                                                                                "space-between"
                                                                            }
                                                                        >
                                                                            <Group>
                                                                                <Avatar
                                                                                    size={
                                                                                        "sm"
                                                                                    }
                                                                                    color="red"
                                                                                />
                                                                                <Text c="red">
                                                                                    {
                                                                                        item.author
                                                                                    }
                                                                                </Text>
                                                                                <Badge
                                                                                    size={
                                                                                        "xs"
                                                                                    }
                                                                                    radius={
                                                                                        "sm"
                                                                                    }
                                                                                    color={
                                                                                        item.role ==
                                                                                        Roles.USER
                                                                                            ? "blue"
                                                                                            : "red"
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        item.role
                                                                                    }
                                                                                </Badge>
                                                                                <Rating
                                                                                    defaultValue={
                                                                                        rating
                                                                                    }
                                                                                    readOnly
                                                                                />
                                                                            </Group>
                                                                            <Badge>
                                                                                {
                                                                                    item.restaurant_name
                                                                                }
                                                                            </Badge>
                                                                        </Group>
                                                                        <Text
                                                                            c={
                                                                                "gray.8"
                                                                            }
                                                                        >
                                                                            {
                                                                                item.review_text
                                                                            }
                                                                        </Text>
                                                                    </Stack>
                                                                </Box>
                                                            </Box>
                                                        );
                                                    },
                                                )}
                                            </Stack>
                                        </Tabs.Panel>

                                        <Tabs.Panel value="restaurant-recommended">
                                            <Grid
                                                justify="start"
                                                align="center"
                                            >
                                                {getRecommendedRestaurants.data?.items.map(
                                                    (item) => {
                                                        return (
                                                            <RestaurantCardComponent
                                                                key={item.id}
                                                                {...item}
                                                            />
                                                        );
                                                    },
                                                )}
                                            </Grid>
                                        </Tabs.Panel>

                                        <Tabs.Panel value="new-restaurant">
                                            <Grid
                                                justify="start"
                                                align="center"
                                            >
                                                {getLatestRestaurants.data?.items.map(
                                                    (item) => {
                                                        return (
                                                            <RestaurantCardComponent
                                                                key={item.id}
                                                                {...item}
                                                            />
                                                        );
                                                    },
                                                )}
                                            </Grid>
                                        </Tabs.Panel>
                                    </Stack>
                                </Tabs>
                            </Stack>
                        </Box>
                    </Container>
                </div>
            </main>
        </>
    );
}
