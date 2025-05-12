
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Biology from "./pages/Biology";
import Chemistry from "./pages/Chemistry";
import Physics from "./pages/Physics";
import BiologyExperiment from "./pages/BiologyExperiment";
import BiologyBloodGroups from "./pages/BiologyBloodGroups";
import BiologyCatalaseExperiment from "./pages/BiologyCatalaseExperiment";
import BiologyPollenGermination from "./pages/BiologyPollenGermination";
import BiologyModels from "./pages/BiologyModels";
import ChemistryExperiment from "./pages/ChemistryExperiment";
import PhysicsExperiment from "./pages/PhysicsExperiment";
import ChemistryLab from "./pages/ChemistryLab";
import VirtualChemistryLab from "./pages/VirtualChemistryLab";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import About from "./pages/About";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vk-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/biology" element={<Biology />} />
              <Route path="/chemistry" element={<Chemistry />} />
              <Route path="/physics" element={<Physics />} />
              <Route path="/about" element={<About />} />
              <Route path="/biology/:experimentId" element={<BiologyExperiment />} />
              <Route path="/biology/blood-groups" element={<BiologyBloodGroups />} />
              <Route path="/biology/catalase" element={<BiologyCatalaseExperiment />} />
              <Route path="/biology/pollen-germination" element={<BiologyPollenGermination />} />
              <Route path="/biology/models" element={<BiologyModels />} />
              <Route path="/chemistry/:experimentId" element={<ChemistryExperiment />} />
              <Route path="/chemistry/lab" element={<ChemistryLab />} />
              <Route path="/chemistry/virtual-lab" element={<VirtualChemistryLab />} />
              <Route path="/physics/:experimentId" element={<PhysicsExperiment />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);

export default App;
