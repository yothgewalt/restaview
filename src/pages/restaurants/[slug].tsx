import React from "react";

import Link from "next/link";
import Image from "next/image";

import { api } from "@restaview/utils/api";

import { notifications } from "@mantine/notifications";
import {
    Stack,
    Text,
    Box,
    Container,
    Breadcrumbs,
    Anchor,
    Flex,
    Rating,
    Group,
    Button,
    Modal,
    Textarea,
    Avatar,
    Badge,
} from "@mantine/core";

import FriedRiceImage from "./../../../public/assets/fried_rice.jpg";
import { useRouter } from "next/router";
import { IconClick, IconPhone } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { useForm } from "@mantine/form";
import { Roles } from "@prisma/client";

type RestaurantReviewPayload = {
    restaurant_id: string;
    review_text: string;
};

const Items = [
    { title: "Home", href: "/" },
    { title: "Restaurants", href: "#" },
].map((item, index) => {
    return (
        <Anchor fz={14} component={Link} href={item.href} key={index}>
            {item.title}
        </Anchor>
    );
});

export default function RestaurantByID() {
    const router = useRouter();
    const restaurantID = router.query.slug as string;

    const { data: sessionData } = useSession();

    const rating = Math.floor(Math.random() * (5 - 3 + 1)) + 3;

    const [opened, { open, close }] = useDisclosure(false);

    const [isCreatingReview, setIsCreatingReview] =
        React.useState<boolean>(false);
    const CreateReview = api.review.createOneReview.useMutation();
    const CreateReviewForm = useForm({
        initialValues: {
            restaurant_id: restaurantID,
            review_text: "",
        },

        validate: {
            review_text: (value) => {
                if (value.length < 32) {
                    return "ข้อความการรีวิวไม่ควรต่ำกว่า 32 ตัวอักษร";
                }
            },
        },
    });

    const OnCreateReviewFormSubmitEvent = async (
        values: RestaurantReviewPayload,
    ) => {
        setIsCreatingReview(true);

        await CreateReview.mutateAsync({
            restaurant_id: values.restaurant_id,
            review_text: values.review_text,
        })
            .then((response) => {
                if (response instanceof Error) {
                    setIsCreatingReview(false);
                    return notifications.show({
                        color: "red",
                        title: "เกิดข้อผิดพลาด",
                        message: response.message,
                    });
                } else {
                    notifications.show({
                        color: "green",
                        title: `รีวิวร้านอาหาร ${restaurantData.data?.name} สำเร็จ`,
                        message:
                            "คุณสามารถดูผลลัพธ์ได้แล้วที่หน้าเว็บไซต์ของร้านอาหารดังกล่าว",
                    });
                    setIsCreatingReview;

                    return void close() && router.reload();
                }
            })
            .catch((error) => {
                setIsCreatingReview(false);
                return notifications.show({
                    color: "red",
                    title: "เกิดข้อผิดพลาด",
                    message: error,
                });
            });
    };

    const restaurantData = api.restaurant.getOneRestaurant.useQuery({
        id: restaurantID,
    });
    if (restaurantData.error) {
        return notifications.show({
            color: "red",
            title: "เกิดข้อผิดพลาดขึ้น",
            message: "ไม่สามารถดึงข้อมูลจากเซิร์ฟเวอร์ต้นทางได้",
        });
    }

    const reviewData = api.review.getAllReviewByRestaurantID.useQuery({
        restaurant_id: restaurantID,
    });

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title={`เขียนรีวิวร้านอาหาร ${restaurantData.data?.name}`}
                centered
            >
                <Box
                    component={"form"}
                    onSubmit={CreateReviewForm.onSubmit((values) => {
                        return void OnCreateReviewFormSubmitEvent(values);
                    })}
                >
                    <Textarea
                        label={"รีวิวร้านอาหาร"}
                        description={
                            "ใส่ข้อความที่คุณต้องการรีวิวลงไปใน Textbox"
                        }
                        placeholder={"ฉันรักที่นี่มาก!"}
                        withAsterisk
                        minRows={6}
                        autosize
                        {...CreateReviewForm.getInputProps("review_text")}
                    />
                    <Stack mt={24} gap={"xs"}>
                        <Text>
                            ให้คะแนนสำหรับร้าน{" "}
                            <strong>{restaurantData.data?.name}</strong>
                        </Text>
                        <Rating defaultValue={5} size={"xl"} />
                    </Stack>
                    <Button
                        mt={24}
                        w={"100%"}
                        loading={isCreatingReview}
                        type={"submit"}
                    >
                        รีวิวร้านอาหาร
                    </Button>
                </Box>
            </Modal>
            <div className="h-auto w-full bg-[#edf0f2] py-8">
                <Container>
                    <Stack>
                        <Box
                            style={{
                                width: "100%",
                                height: "100%",
                                padding: "16px",
                                borderRadius: "8px",
                                background: "#ffffff",
                            }}
                        >
                            <Stack gap={"xl"}>
                                <Breadcrumbs separator="→">{Items}</Breadcrumbs>
                                <Box className="relative h-[24rem] w-full overflow-hidden bg-transparent">
                                    <Image
                                        src={FriedRiceImage}
                                        alt="A hero image for restaview website."
                                        priority
                                        fill
                                        style={{
                                            position: "absolute",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            objectPosition: "center",
                                            zIndex: 10,
                                        }}
                                    />
                                    <Box
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            backgroundColor:
                                                "rgba(0, 0, 0, 0.2)",
                                            backdropFilter: "blur(10px)",
                                            WebkitBackdropFilter: "blur(10px)",
                                            borderRadius: "8px",
                                            zIndex: 20,
                                        }}
                                    >
                                        <Flex
                                            w={"100%"}
                                            h={"100%"}
                                            direction={"column"}
                                            justify={"center"}
                                            align={"center"}
                                            wrap={"nowrap"}
                                        >
                                            <Text fw={700} fz={28} c={"white"}>
                                                ร้านอาหาร
                                            </Text>
                                            <Rating
                                                defaultValue={rating}
                                                size={"xl"}
                                                readOnly
                                            />
                                            <Text
                                                fw={700}
                                                ta={"center"}
                                                fz={48}
                                                c={"yellow.3"}
                                            >
                                                {restaurantData.data?.name}
                                            </Text>
                                            <Text
                                                fw={400}
                                                ta={"center"}
                                                fz={18}
                                                c={"yellow.1"}
                                            >
                                                {restaurantData.data?.location}
                                            </Text>
                                        </Flex>
                                    </Box>
                                </Box>
                                <Stack>
                                    <Text fz={16}>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit. Sed vitae interdum mi.
                                        Nam pellentesque tellus eget ornare
                                        luctus. Pellentesque tincidunt
                                        pellentesque tortor, eu suscipit tortor
                                        lacinia vel. Fusce accumsan, elit vel
                                        pulvinar rutrum, nulla dolor condimentum
                                        neque, eget consectetur turpis tortor
                                        eget urna. Ut ultricies vestibulum
                                        massa. Proin tortor mi, tempus ac
                                        rhoncus non, ultrices eget est. Nunc
                                        eleifend ut elit non ultrices. Nullam ac
                                        sapien ut purus rhoncus porttitor. Etiam
                                        congue congue augue sit amet ornare.
                                        Vivamus id ligula quam. Ut nec est vitae
                                        leo vestibulum placerat sed et nisl.
                                        Aenean risus felis, euismod vitae
                                        ultricies nec, venenatis ut elit. Fusce
                                        eu dictum urna, et vestibulum massa.
                                        Maecenas a nibh eleifend augue laoreet
                                        facilisis eu et augue. Aliquam augue
                                        dolor, tempor at ultrices eget, ultrices
                                        vitae odio. Nulla quis faucibus lectus.
                                        Integer sed urna condimentum, fermentum
                                        erat eget, dignissim tellus. Nunc
                                        laoreet enim non pellentesque blandit.
                                        Quisque porttitor enim a orci fermentum
                                        sodales. Vivamus pellentesque interdum
                                        leo vitae luctus. Cras nec congue
                                        mauris. Etiam at enim vehicula, rutrum
                                        mi vitae, vehicula ipsum. Vestibulum at
                                        ante elementum sem commodo facilisis sed
                                        sit amet libero.
                                    </Text>
                                </Stack>
                                <Stack gap={8}>
                                    <Text fw={700} fz={24} c={"blue.5"}>
                                        รายละเอียดร้านอาหาร
                                    </Text>
                                    <Stack gap={0}>
                                        <Text>
                                            <IconPhone size={14} />{" "}
                                            เบอร์โทรศัพท์{" "}
                                            <strong>
                                                {
                                                    restaurantData.data
                                                        ?.phone_number
                                                }
                                            </strong>
                                        </Text>
                                        <Text>
                                            <IconClick size={14} />{" "}
                                            จำนวนการรีวิวทั้งหมด{" "}
                                            <strong>
                                                {
                                                    restaurantData.data
                                                        ?.number_of_reviews
                                                }{" "}
                                                ครั้ง
                                            </strong>
                                        </Text>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Box>
                        <Box
                            style={{
                                width: "100%",
                                height: "100%",
                                padding: "16px",
                                borderRadius: "8px",
                                background: "#ffffff",
                            }}
                        >
                            <Group justify={"space-between"} align={"start"}>
                                <Stack gap={0} mb={32}>
                                    <Text fw={700} fz={22}>
                                        รีวิวร้านอาหาร
                                    </Text>
                                    <Text fz={18} c={"gray.6"}>
                                        การรีวิวทั้งหมดเกิดขึ้นจากผู้ใช้งานของเว็บไซต์เรา
                                    </Text>
                                </Stack>
                                {sessionData?.user && (
                                    <Button
                                        radius={"md"}
                                        color={"green"}
                                        onClick={open}
                                    >
                                        รีวิวร้านอาหาร
                                    </Button>
                                )}
                            </Group>
                            <Box
                                p={16}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    padding: "16px",
                                    borderRadius: "8px",
                                }}
                                bg={"gray.4"}
                            >
                                <Stack>
                                    {reviewData.data?.reviews.map(
                                        (item, index) => {
                                            return (
                                                <Box
                                                    w={"100%"}
                                                    h={"auto"}
                                                    key={index}
                                                >
                                                    <Box
                                                        p={12}
                                                        style={{
                                                            borderRadius: "8px",
                                                        }}
                                                        bg={"gray.1"}
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
                                                            <Text c={"gray.8"}>
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
                            </Box>
                        </Box>
                    </Stack>
                </Container>
            </div>
        </>
    );
}
