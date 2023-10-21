import React from "react";

import { useRouter } from "next/router";
import Link from 'next/link'

import { signIn, useSession } from "next-auth/react";

import {
    Anchor,
    Box,
    Button,
    Checkbox,
    Container,
    Flex,
    Group,
    Loader,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

type SignInPayload = {
    email_address: string;
    password: string;
};
export default function SignIn() {
    const router = useRouter();
    const { data: sessionData } = useSession();

    const form = useForm({
        initialValues: {
            email_address: '',
            password: ''
        },

        validate: {
            email_address: isEmail('รูปแบบอีเมลไม่ถูกต้อง')
        }
    })

    const OnFormSubmit =  async (values: SignInPayload) => {
        return await signIn(
            'credentials',
            {
                username: values.email_address,
                password: values.password,
                redirect: false
            }
        ).then(async (response) => {
            if (response?.error === null) {
                return await router.push('/');

            } else {
                return notifications.show({
                    color: 'red',
                    title: 'ดูเหมือนว่าคุณจะมีปัญหา',
                    message: response?.error
                })
            }
        });
    }

    React.useEffect(() => {
        void (async () => {
            if (sessionData?.user) {
                return await router.push('/');
            }
        })();
    }, [router, sessionData?.user])

    if (sessionData?.user) {
        return (
            <div className="w-full h-[47.5rem] bg-white">
                <Container h={'100%'}>
                    <Flex
                        h={'100%'}
                        direction={'column'}
                        justify={'center'}
                        align={'center'}
                        wrap={'nowrap'}
                    >
                        <Loader size={50} />
                    </Flex>
                </Container>
            </div>
        );
    } else {
        return (
            <Box w={"100%"} h={"auto"} py={"3rem"} bg={"white"}>
                <Container size={420}>
                    <Title ta="center">ยินดีต้อนรับกลับมา!</Title>
                    <Text c="dimmed" size="sm" ta="center" mt={5}>
                        คุณยังไม่มีบัญชีใช่ไหม?{" "}
                        <Anchor size="sm" component={Link} href={'/auth/signup'}>
                            สร้างบัญชี
                        </Anchor>
                    </Text>

                    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                        <Box component={"form"} onSubmit={form.onSubmit((values) => void OnFormSubmit(values))}>
                            <TextInput
                                label="อีเมล"
                                name="username"
                                placeholder="อีเมลของคุณ"
                                required
                                {...form.getInputProps('email_address')}
                            />
                            <PasswordInput
                                label="รหัสผ่าน"
                                name="password"
                                placeholder="รหัสผ่านของคุณ"
                                required
                                mt="md"
                                {...form.getInputProps('password')}
                            />
                            <Group justify="space-between" mt="lg">
                                <Checkbox label="จดจำฉันไว้ในระบบ" />
                                <Anchor component="button" size="sm">
                                    คุณลืมรหัสผ่าน?
                                </Anchor>
                            </Group>
                            <Button type={'submit'} fullWidth mt="xl">
                                เข้าสู่ระบบ
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        );
    }
}
