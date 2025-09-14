"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, Github, Linkedin, Trophy, Code, Brain, Rocket } from "lucide-react"

interface ContactSectionProps {
  onNavigate: (section: "home" | "get-started" | "prediction" | "model-info" | "contact") => void
}

export function ContactSection({ onNavigate }: ContactSectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 relative overflow-hidden">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-6 w-6 text-primary animate-neural-pulse" />
            </div>
            <span className="text-xl font-bold">AI Hackathon</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate("home")}>
              ← Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Contact Content */}
      <section className="pt-32 pb-24 px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium animate-pulse-glow">
              <Users className="mr-2 h-4 w-4" />
              Meet Our Team
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
              The Minds Behind the
              <span className="text-primary block mt-2 animate-neural-pulse">AI Innovation</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto text-pretty">
              A passionate team of AI enthusiasts, machine learning engineers, and data scientists working together to
              push the boundaries of artificial intelligence.
            </p>
          </div>

          {/* Team Photo Section */}
          <div className="mb-16">
            <Card className="group hover:shadow-xl transition-all duration-500 border-primary/20 hover:border-primary/40 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Placeholder for team photo */}
                  <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 via-accent/10 to-chart-2/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="p-6 bg-background/80 rounded-2xl backdrop-blur-sm border border-border/50">
                        <Users className="h-16 w-16 text-primary mx-auto mb-4 animate-neural-pulse" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">Team Photo</h3>
                        <p className="text-muted-foreground">
                          Upload your group photo here to showcase your amazing team!
                        </p>
                        <Button className="mt-4 bg-transparent" variant="outline">
                          <Github className="mr-2 h-4 w-4" />
                          Add Team Photo
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Overlay with team stats */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-background/90 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">5</div>
                          <div className="text-sm text-muted-foreground">Team Members</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-accent">3</div>
                          <div className="text-sm text-muted-foreground">AI Models</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-chart-2">48h</div>
                          <div className="text-sm text-muted-foreground">Hackathon Time</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-chart-3">96%</div>
                          <div className="text-sm text-muted-foreground">Accuracy</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Team Description */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-primary/20 hover:border-primary/40">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <Rocket className="h-8 w-8 text-primary animate-neural-pulse" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Our Mission</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      AI Innovation
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed mb-6">
                  We're a diverse team of passionate developers, data scientists, and AI researchers united by our
                  shared vision of making artificial intelligence more accessible and impactful. Our hackathon project
                  represents months of research, experimentation, and collaborative innovation.
                </CardDescription>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Code className="h-5 w-5 text-primary" />
                    <span className="text-sm">Full-stack development expertise</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-accent" />
                    <span className="text-sm">Advanced machine learning knowledge</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-chart-2" />
                    <span className="text-sm">Competitive programming experience</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-accent/20 hover:border-accent/40">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                    <Mail className="h-8 w-8 text-accent animate-neural-pulse" style={{ animationDelay: "0.5s" }} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Get In Touch</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      Let's Connect
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed mb-6">
                  Interested in our work? Want to collaborate on future AI projects? We'd love to hear from you! Connect
                  with us through any of the channels below.
                </CardDescription>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                    <Mail className="mr-3 h-5 w-5" />
                    team@aihackathon.dev
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                    <Github className="mr-3 h-5 w-5" />
                    github.com/ai-hackathon-team
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                    <Linkedin className="mr-3 h-5 w-5" />
                    LinkedIn Team Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Members Placeholder */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-balance">Team Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { role: "Team Lead & ML Engineer", icon: Brain, color: "primary" },
                { role: "Frontend Developer", icon: Code, color: "accent" },
                { role: "Data Scientist", icon: Trophy, color: "chart-2" },
                { role: "Backend Developer", icon: Rocket, color: "chart-3" },
                { role: "UI/UX Designer", icon: Users, color: "chart-4" },
              ].map((member, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 text-center">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      <div
                        className={`p-4 bg-${member.color}/10 rounded-full group-hover:bg-${member.color}/20 transition-colors`}
                      >
                        <member.icon
                          className={`h-8 w-8 text-${member.color} animate-neural-pulse`}
                          style={{ animationDelay: `${index * 0.2}s` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4 mx-auto animate-pulse" />
                      <div className="text-sm text-muted-foreground">{member.role}</div>
                      <div className="h-3 bg-muted/50 rounded w-1/2 mx-auto animate-pulse" />
                    </div>
                    <Button variant="ghost" size="sm" className="mt-4">
                      Add Member Info
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="inline-block p-8 bg-gradient-to-r from-primary/5 via-accent/5 to-chart-2/5 border-primary/20">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-4 text-balance">Ready to Experience Our AI Models?</h3>
                <p className="text-muted-foreground mb-6 text-pretty">
                  Try our interactive prediction system and see the power of machine learning in action.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button size="lg" className="animate-pulse-glow" onClick={() => onNavigate("prediction")}>
                    <Brain className="mr-2 h-5 w-5" />
                    Try Predictions
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => onNavigate("model-info")}>
                    <Code className="mr-2 h-5 w-5" />
                    View Models
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
