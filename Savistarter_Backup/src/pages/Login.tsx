import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { ArrowRight } from 'lucide-react';

type LoginFormValues = {
  studentName: string;
  classId: string;
};

const Login = () => {
  const navigate = useNavigate();
  
  // Setup form with react-hook-form
  const form = useForm<LoginFormValues>({
    defaultValues: {
      studentName: '',
      classId: ''
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    // Show success toast
    toast({
      title: "Welcome!",
      description: `Hello ${data.studentName}! You're joining class ${data.classId}.`,
    });
    
    // Navigate to course selector after a short delay
    setTimeout(() => {
      navigate('/courses');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-savi-yellow opacity-10 rounded-b-full"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-savi-pink opacity-10 rounded-t-full"></div>
      <div className="absolute top-20 right-10 w-16 h-16 bg-savi-blue rounded-full opacity-20 animate-float"></div>
      <div className="absolute bottom-20 left-10 w-12 h-12 bg-savi-green rounded-full opacity-20 animate-float-reverse"></div>
      
      <div className="w-full max-w-md z-10">
        <Card className="border-4 border-savi-blue/20 bg-white/90 backdrop-blur shadow-xl">
          <CardHeader className="flex flex-col items-center gap-4 pt-6">
            <Logo size="small" />
            <h1 className="text-3xl font-bold text-center text-gray-800 mt-2">
              Welcome!
            </h1>
            <p className="text-center text-gray-600">
              Please enter your details to continue
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-gray-700">Student Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your name" 
                          className="h-12 text-base bg-blue-50/50 border-2 border-savi-blue/30 focus-visible:ring-savi-blue/50 placeholder:text-gray-400" 
                          {...field} 
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-gray-700">Class ID</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter class ID" 
                          className="h-12 text-base bg-blue-50/50 border-2 border-savi-blue/30 focus-visible:ring-savi-blue/50 placeholder:text-gray-400" 
                          {...field} 
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full h-14 mt-6 bg-gradient-to-r from-savi-blue to-blue-500 hover:from-blue-500 hover:to-savi-blue text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Enter
                  <ArrowRight className="ml-1 h-6 w-6" />
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <p className="text-sm text-gray-500">
              © 2023 SAVI English Explorer
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
