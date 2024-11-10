"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    maxPlayers: z.number().int().min(2, {
        message: "Must have at least 2 players.",
    }).max(4, {
        message: "Must have at most 4 players.",
    }),
    maxRounds: z.number().int().min(1, {
        message: "Game must run for at least 1 round.",
    }).max(4, {
        message: "Game can run for at most 10 rounds.",
    }),
})

const page = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            maxPlayers: 2,
            maxRounds: 1,
        },
    })
    const router = useRouter()
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        router.push('/game-lobby')
    }
    return (
        <div className='min-h-screen pt-[10vh]'>
            <div className='flex flex-col gap-4 items-center justify-between w-full max-w-4xl mx-auto px-4'>
                {/* HEAD */}
                <div className="text-center w-full">
                    <h1 className="text-3xl font-bold mb-2">Create a Game</h1>
                </div>

                {/* FORM BUTTONS */}

                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="maxPlayers"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of Players</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type='number'
                                                placeholder="2"
                                                {...field}
                                                step={1}
                                                min={2}
                                                max={4}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Number of players that can play the game.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="maxRounds"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of Rounds</FormLabel>
                                        <FormControl>
                                            <Input type='number'
                                            placeholder="2"
                                            {...field}
                                            step={1}
                                            min={1}
                                            max={10}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                        </FormControl>
                                        <FormDescription>
                                            Number of rounds before the game ends.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='flex flex-row p-2 gap-4'>
                                <Button type="submit">Create Game</Button>
                                <Link href='/'><Button >Cancel</Button></Link>

                            </div>

                        </form>
                    </Form>
                </div>

            </div>

        </div>

    )

}

export default page