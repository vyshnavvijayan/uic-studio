"use client";

import React from "react";
import { SiteContent, SectionType } from "@/types/content";
import { HeroCanvas } from "@/components/HeroCanvas";
import { StudioIntro } from "@/components/StudioIntro";
import { Services } from "@/components/Services";
import { NfcShowcase } from "@/components/NfcShowcase";
import { SelectedWork } from "@/components/SelectedWork";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";

interface SectionRendererProps {
  content: SiteContent;
  onOpenInquiry?: () => void;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({
  content,
  onOpenInquiry,
}) => {
  const accentColor = content.brand?.accentColor || "#c6f36b";
  const { sections, sectionOrder } = content;

  return (
    <main className="w-full">
      {sectionOrder.map((sectionKey: SectionType) => {
        switch (sectionKey) {
          case "hero":
            return sections.hero.enabled ? (
              <HeroCanvas
                key="hero"
                content={sections.hero}
                accentColor={accentColor}
              />
            ) : null;

          case "studioIntro":
            return sections.studioIntro.enabled ? (
              <StudioIntro
                key="studioIntro"
                content={sections.studioIntro}
                accentColor={accentColor}
              />
            ) : null;

          case "services":
            return sections.services.enabled ? (
              <Services
                key="services"
                content={sections.services}
                accentColor={accentColor}
              />
            ) : null;

          case "nfcShowcase":
            return sections.nfcShowcase.enabled ? (
              <NfcShowcase
                key="nfcShowcase"
                content={sections.nfcShowcase}
                accentColor={accentColor}
                onOpenInquiry={onOpenInquiry}
              />
            ) : null;

          case "work":
            return sections.work.enabled ? (
              <SelectedWork
                key="work"
                content={sections.work}
                accentColor={accentColor}
                onOpenInquiry={onOpenInquiry}
              />
            ) : null;

          case "process":
            return sections.process.enabled ? (
              <Process
                key="process"
                content={sections.process}
                accentColor={accentColor}
              />
            ) : null;

          case "testimonials":
            return sections.testimonials.enabled ? (
              <Testimonials
                key="testimonials"
                content={sections.testimonials}
                accentColor={accentColor}
              />
            ) : null;

          case "faq":
            return sections.faq.enabled ? (
              <Faq
                key="faq"
                content={sections.faq}
                accentColor={accentColor}
              />
            ) : null;

          case "contact":
            return sections.contact.enabled ? (
              <Contact
                key="contact"
                content={sections.contact}
                accentColor={accentColor}
                onOpenInquiry={onOpenInquiry}
              />
            ) : null;

          default:
            return null;
        }
      })}
    </main>
  );
};
