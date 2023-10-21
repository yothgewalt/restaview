import React from "react";

import Link from "next/link";

import { isEmail, useForm } from "@mantine/form";
import {
    Container,
    Title,
    Text,
    Anchor,
    Paper,
    TextInput,
    PasswordInput,
    Group,
    Button,
    Center,
    Box,
    Progress,
    Stack,
    Loader,
    Flex,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import { api } from "@restaview/utils/api";

import { signIn, useSession } from "next-auth/react";

import { CharacterValidator } from "@restaview/utils/strings";
import { useRouter } from "next/router";

type Requirement = {
    meets: boolean;
    label: string;
};

type RequirementRegularExpression = {
    re: RegExp;
    label: string;
};

type RegisterPayload = {
    email_address: string;
    first_name: string;
    last_name: string;
    password: string;
};

function PasswordRequirement({ meets, label }: Requirement) {
    return (
        <Text component="div" c={meets ? "teal" : "red"} mt={5} size="sm">
            <Center inline>
                {meets ? (
                    <IconCheck size={"0.9rem"} stroke={1.5} />
                ) : (
                    <IconX size={"0.9rem"} stroke={1.5} />
                )}
                <Box ml={7}>{label}</Box>
            </Center>
        </Text>
    );
}

const requirements: RequirementRegularExpression[] = [
    { re: /[0-9]/, label: "มีตัวเลข" },
    { re: /[a-z]/, label: "มีตัวอักษรแบบเล็ก" },
    { re: /[A-Z]/, label: "มีตัวอักษรแบบใหญ่" },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "มีตัวอักษรพิเศษ" },
];

function GetStrength(password: string) {
    let multiplier = password.length > 5 ? 0 : 1;

    requirements.forEach((requirement) => {
        if (!requirement.re.test(password)) {
            multiplier += 1;
        }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

export default function SignUp() {
    const router = useRouter();

    const { data: sessionData } = useSession();
    const createUser = api.user.createOneUser.useMutation();

    const [submitButtonLoading, setSubmitButtionLoading] = useInputState(false);

    const form = useForm({
        initialValues: {
            email_address: "",
            first_name: "",
            last_name: "",
            password: "",
        },

        validate: {
            email_address: isEmail("รูปแบบอีเมลไม่ถูกต้อง"),
            first_name: (value) => CharacterValidator(value),
            last_name: (value) => CharacterValidator(value),
        },
    });

    const strength = GetStrength(form.values.password);
    const checks = requirements.map((requirement, index) => (
        <PasswordRequirement
            key={index}
            label={requirement.label}
            meets={requirement.re.test(form.values.password)}
        />
    ));

    const bars = Array(4)
        .fill(0)
        .map((_, index) => (
            <Progress
                key={index}
                styles={{
                    section: {
                        transitionDuration: "0ms",
                    },
                }}
                value={
                    form.values.password.length > 0 && index === 0
                        ? 100
                        : strength >= ((index + 1) / 4) * 100
                        ? 100
                        : 0
                }
                color={
                    strength > 80 ? "teal" : strength > 50 ? "yellow" : "red"
                }
                size={4}
            />
        ));

    const OnFormSubmit = async (values: RegisterPayload) => {
        setSubmitButtionLoading(true);

        if (strength !== 100) {
            setSubmitButtionLoading(false);
            return notifications.show({
                color: "red",
                title: "รหัสผ่านไม่ปลอดภัย",
                message:
                    "ดูเหมือนว่ารหัสผ่านของคุณจะไม่ปลอดภัยตามกฏเกฑณ์ของเรา",
            });
        }

        await createUser
            .mutateAsync({
                email_address: values.email_address.toLowerCase(),
                first_name: values.first_name.toLowerCase(),
                last_name: values.last_name.toLowerCase(),
                password: values.password,
            })
            .then((response) => {
                if (response instanceof Error) {
                    setSubmitButtionLoading(false);
                    return notifications.show({
                        color: "red",
                        title: "เกิดข้อผิดพลาด",
                        message: response.message,
                    });
                } else {
                    notifications.show({
                        color: "green",
                        title: `สมัครสมาชิกสำเร็จ ${response.email_address}`,
                        message: "กำลังนำคุณไปสู่หน้าล็อกอินเพื่อเข้าสู่ระบบ",
                    });
                    setSubmitButtionLoading(false);

                    setTimeout(() => {
                        void (async () => {
                            return await signIn();
                        })();
                    }, 2048);
                }
            })
            .catch((error) => {
                setSubmitButtionLoading(false);
                return notifications.show({
                    color: "red",
                    title: "เกิดข้อผิดพลาด",
                    message: error,
                });
            });
    };

    React.useEffect(() => {
        void (async () => {
            if (sessionData?.user) {
                return await router.push("/");
            }
        })();
    }, [router, sessionData?.user]);

    if (sessionData?.user) {
        return (
            <div className="h-[47.5rem] w-full bg-white">
                <Container h={"100%"}>
                    <Flex
                        h={"100%"}
                        direction={"column"}
                        justify={"center"}
                        align={"center"}
                        wrap={"nowrap"}
                    >
                        <Loader size={50} />
                    </Flex>
                </Container>
            </div>
        );
    } else {
        return (
            <div className="h-auto w-full bg-white py-14">
                <Container size={420}>
                    <Title ta="center">Welcome!</Title>
                    <Text c="dimmed" size="md" ta="center" mt={5}>
                        คุณมีบัญชีอยู่แล้วใช่ไหม?{" "}
                        <Anchor
                            size="md"
                            component={Link}
                            href={"/auth/signup"}
                        >
                            เข้าสู่ระบบ
                        </Anchor>
                    </Text>

                    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                        <form
                            onSubmit={form.onSubmit(
                                (values) => void OnFormSubmit(values),
                            )}
                        >
                            <Stack>
                                <TextInput
                                    label="อีเมล"
                                    name="email"
                                    placeholder="อีเมลของคุณ"
                                    required
                                    {...form.getInputProps("email_address")}
                                />
                                <TextInput
                                    label="ชื่อจริง"
                                    name="firstname"
                                    placeholder="ชื่อจริงของคุณ"
                                    required
                                    {...form.getInputProps("first_name")}
                                />
                                <TextInput
                                    label="นามสกุล"
                                    name="lastname"
                                    placeholder="นามสกุลของคุณ"
                                    required
                                    {...form.getInputProps("last_name")}
                                />
                                <div>
                                    <PasswordInput
                                        placeholder="รหัสผ่านของอีเมล"
                                        label="รหัสผ่าน"
                                        required
                                        {...form.getInputProps("password")}
                                    />

                                    <Group gap={5} grow mt="xs" mb="md">
                                        {bars}
                                    </Group>

                                    <PasswordRequirement
                                        label="มีตัวอักษรทั้งหมดรวมกันอย่างน้อย 5 ตัว"
                                        meets={form.values.password.length > 5}
                                    />
                                    {checks}
                                </div>
                            </Stack>
                            <Button
                                type={"submit"}
                                loading={submitButtonLoading}
                                fullWidth
                                mt="xl"
                            >
                                สมัครสมาชิก
                            </Button>
                        </form>
                    </Paper>
                </Container>
            </div>
        );
    }
}
