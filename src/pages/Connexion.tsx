
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from 'react-router-dom';

const formSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide",
  }),
  password: z.string().min(1, {
    message: "Veuillez entrer votre mot de passe",
  }),
});

const Connexion = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Handle form submission
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">Connexion</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="votre@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Votre mot de passe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Link to="/mot-de-passe-oublie" className="text-sm text-torah-600 hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
              
              <Button type="submit" className="w-full">Se connecter</Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte? <Link to="/inscription" className="text-torah-600 hover:underline">S'inscrire</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Connexion;
