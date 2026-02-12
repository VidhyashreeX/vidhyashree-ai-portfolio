import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema, type InsertMessage } from "@shared/schema";
import { useSendMessage } from "@/hooks/use-contact";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Send, Loader2, Github, Linkedin, Mail, MapPin } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const { mutate: sendMessage, isPending } = useSendMessage();

  const form = useForm<InsertMessage>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "vidyashri1510@gmail.com",
      message: "",
    },
  });

  const onSubmit = (data: InsertMessage) => {
    sendMessage(data, {
      onSuccess: () => {
        toast({
          title: "Message Sent",
          description: "Thank you for reaching out. I'll get back to you soon.",
          className: "bg-background border-primary/20 text-foreground",
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <section className="pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid gap-10 md:grid-cols-2 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:order-1"
        >
          <div className="glass p-6 md:p-7 rounded-2xl border border-white/5 shadow-2xl shadow-black/20 max-w-md">
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-5">Contact</h2>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="kaveri"
                        {...field}
                        className="bg-background/30 border-white/10 focus:border-primary/50 h-10 rounded-xl transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your message..."
                        {...field}
                        className="bg-background/30 border-white/10 focus:border-primary/50 min-h-[100px] rounded-xl resize-none transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300"
              >
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </Form>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:pt-6 md:order-2"
        >
          <h3 className="text-3xl md:text-4xl font-bold font-display mb-6">Get in touch</h3>
          <div className="flex flex-col items-start gap-4">
            <a
              href="https://github.com/VidhyashreeX"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Profile"
              className="glass p-4 rounded-2xl border border-white/10 hover:border-primary/50 hover:text-primary transition-all duration-300"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/vidhyashree-s"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn Profile"
              className="glass p-4 rounded-2xl border border-white/10 hover:border-primary/50 hover:text-primary transition-all duration-300"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="mailto:vidyashri1510@gmail.com"
              aria-label="Email"
              className="glass p-4 rounded-2xl border border-white/10 hover:border-primary/50 hover:text-primary transition-all duration-300"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
          <div className="mt-6 flex items-center justify-start gap-3 glass p-4 rounded-2xl border border-white/10 text-foreground text-left w-fit">
            <MapPin className="w-6 h-6" />
            <span>Bengaluru</span>
          </div>
        </motion.div>
        </div>
    </section>
  );
}
