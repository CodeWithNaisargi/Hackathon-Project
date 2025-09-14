"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Users,
  Brain,
  Code,
  Award,
  Linkedin,
  Github,
  Mail,
} from "lucide-react"

interface TeamSectionProps {
  onNavigate: (section: "home" | "get-started" | "prediction" | "solar-prediction" | "model-info" | "contact" | "team") => void
}

export function TeamSection({ onNavigate }: TeamSectionProps) {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)

  const teamMembers = [
    {
      id: 1,
      name: "Naisargi Patel",
      role: "Team Lead",
      position: "AI Research Director",
      image: "/images/team/naisargi.jpg",
      description: "Passionate about creating seamless and visually appealing user interfaces.",
      skills: ["Front-end", "Backend", "Hosting", "Database Management"],
      social: {
        linkedin: "https://www.linkedin.com/in/codewithnaisargi",
        github: "https://github.com/CodeWithNaisargi",
        email: "sarah@genwetherai.com"
      }
    },
    {
      id: 2,
      name: "Divy Pattani",
      role: "ML Engineer",
      position: "Senior Data Scientist",
      image: "/images/team/divy.jpg",
      description: "Passionate about Data analysis and visualization.",
      skills: ["Python", "TensorFlow", "Front-end", "Django"],
      social: {
        linkedin: "https://www.linkedin.com/in/divy-pattani",
        github: "https://github.com/ONLYCAKE",
        email: "divy2546@gmail.com"
      }
    },
    {
      id: 3,
      name: "Dhruv Munjpara",
      role: "Frontend Engineer",
      position: "Data Pipeline Architect",
      image: "/images/team/dhruv.jpg",
      description: "Building Animated UI Using Javascript Frameworks",
      skills: ["HTML5", "CSS3", "NodeJs", "Javascript"],
      social: {
        linkedin: "http://www.linkedin.com/in/dhruv-munjpara",
        github: "https://github.com/dhruvmu",
        email: "dhruvmunjpara11@gmail.com"
      }
    },
    {
      id: 4,
      name: "Dev Gondaliya",
      role: "Backend Engineer",
      position: "Frontend AI Integration",
      image: "/images/team/dev.jpg",
      description: "Data Modelling and Integrating with API's",
      skills: ["React", "TypeScript", "UI/UX", "API Integration"],
      social: {
        linkedin: "https://in.linkedin.com/in/dev-gondaliya",
        github: "https://github.com/Web-Dev-With-Dev",
        email: "24csdev043@ldce.ac.in"
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 relative overflow-hidden">
      {/* 3D Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-chart-2/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        
        {/* 3D Floating Elements */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              transform: `translateZ(${Math.random() * 100}px)`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => onNavigate("home")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <Badge variant="secondary" className="animate-pulse-glow">
            Our Team
          </Badge>
          <Button onClick={() => onNavigate("solar-prediction")} className="animate-pulse-glow">
            Try Solar Prediction
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance animate-slide-up">
            Meet Our Team
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty animate-slide-up" style={{ animationDelay: "0.2s" }}>
            The brilliant minds behind GenWetherAI's solar power prediction technology
          </p>
        </section>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <Card
              key={member.id}
              className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 animate-scale-in ${
                hoveredMember === member.id ? "ring-2 ring-primary shadow-2xl scale-105" : ""
              }`}
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto mb-4">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-28 h-28 rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Badge variant="secondary" className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription className="text-sm font-medium">{member.position}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  {member.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-center">Skills</h4>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                    onClick={() => window.open(member.social.linkedin, '_blank')}
                    title={`Visit ${member.name}'s LinkedIn`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                    onClick={() => window.open(member.social.github, '_blank')}
                    title={`Visit ${member.name}'s GitHub`}
                  >
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors"
                    onClick={() => window.open(`mailto:${member.social.email}`, '_blank')}
                    title={`Email ${member.name}`}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Stats */}
        <section className="bg-muted/30 rounded-2xl p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: "Team Members", value: "4", icon: Users },
              { label: "Years Experience", value: "1+", icon: Award },
              { label: "AI Models Built", value: "6", icon: Brain },
              { label: "Lines of Code", value: "50K+", icon: Code },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center animate-scale-in" style={{ animationDelay: `${0.8 + index * 0.1}s` }}>
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance mb-4">
            Ready to Experience Our Technology?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            See our team's work in action with our advanced solar power prediction system
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" className="animate-pulse-glow" onClick={() => onNavigate("solar-prediction")}>
              <Brain className="mr-2 h-5 w-5" />
              Try Solar Prediction
            </Button>
            <Button variant="outline" size="lg" onClick={() => onNavigate("model-info")}>
              <Code className="mr-2 h-5 w-5" />
              Explore Models
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
