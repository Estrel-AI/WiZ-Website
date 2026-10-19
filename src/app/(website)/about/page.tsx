import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fetchPublicSectionHeader } from "@/src/lib/website-section-headers";
import { getWebsiteOurMissions } from "@/src/lib/website-our-missions";
import { getWebsiteAboutTeamMembers } from "@/src/lib/website-about-team";
import { getWebsitePageSectionKeys } from "@/src/lib/website-page-sections";
import { buildWebsiteMetadata, websiteOgImages } from "@/src/lib/website-og";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildWebsiteMetadata({
  title: { absolute: "About WiiZ – Enterprise Agentic AI Platform & Company Vision" },
  description: "Discover the story behind WiiZ and the Team.",
  path: "/about",
  image: websiteOgImages.about,
});

export default async function AboutPage() {
  const [visionHeader, missions, leadershipTeam, keyProductTeam, sectionOrder] = await Promise.all([
    fetchPublicSectionHeader("VISION").catch(() => null),
    getWebsiteOurMissions().catch(() => []),
    getWebsiteAboutTeamMembers("LEADERSHIP").catch(() => []),
    getWebsiteAboutTeamMembers("PRODUCT").catch(() => []),
    getWebsitePageSectionKeys("ABOUT").catch(() => ["VISION", "MISSIONS", "LEADERSHIP", "PRODUCT"]),
  ]);

  const visionImage = visionHeader?.buttonUrl?.trim() || "/api/assets/dummy_image/about_section.png";
  const visionBgImage = visionHeader?.backgroundImage?.trim() || null;

  const sectionsByKey: Record<string, ReactNode> = {
    VISION: (
      <main className="bg-primary min-h-[60vh] flex items-center justify-center relative overflow-hidden px-4 py-10 md:py-20 font-sans">
        {/* Dynamic background image — rendered behind all other layers */}
        {visionBgImage ? (
          <div className="absolute inset-0 z-0">
            <img
              src={visionBgImage}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-primary/60" />
          </div>
        ) : null}

        <div className="md:block hidden absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[160%] lg:w-[120%] xl:w-[90%] h-[100%] bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none [-webkit-mask-image:radial-gradient(circle_at_center, quaternary_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-[1]"></div>
        <div className="md:block hidden absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[160%] lg:w-[120%] xl:w-[90%] h-[100%] bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none [-webkit-mask-image:radial-gradient(circle_at_center,quaternary_0_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-[1]"></div>
        <div className="absolute -top-[250px] left-1/2 transform -translate-x-1/2 w-[600px] h-[500px] bg-gradient-about blur-[200px] rounded-full pointer-events-none z-[1]"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {visionHeader?.badgeText ? (
            <div className="mb-4 inline-block rounded-full border border-[#5E4A47] bg-[#211A2533] px-4 py-1 shadow-sm">
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#E68F17]">
                {visionHeader.badgeText}
              </span>
            </div>
          ) : null}
          <h1
            data-aos="fade-up"
            data-aos-duration="1000"
            className="text-3xl md:text-4xl lg:text-5xl leading-tight md:leading-[1.1] font-semibold text-white mb-3 md:mb-6 tracking-tight md:px-10"
          >
            {visionHeader?.heading || "The Enterprise AI Workforce Needs an Operating System"}
          </h1>
          {visionHeader?.description ? (
            <p
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="200"
              className="text-base md:text-lg text-[#FDFDFD] max-w-4xl mx-auto md:px-16 italic"
            >
              {visionHeader.description}
            </p>
          ) : null}
        </div>
      </main>
    ),
    MISSIONS: (
      <section className="relative bg-gradient-to-r from-[#0f0e12] via-[#1a151c] to-[#1f1a21] py-8 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans text-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-4 md:p-6 md:gap-12 lg:gap-20 relative z-10">
          <div
            className="w-full lg:w-1/2 flex flex-col justify-center text-left"
            data-aos="fade-right"
            data-aos-duration="2000"
          >
            <div className="mb-2 md:mb-6">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-secondary/30 text-secondary text-xs font-bold tracking-widest uppercase bg-secondary/5">
                Our Mission
              </span>
            </div>

            {missions.length > 0 ? (
              missions.map((item) => (
                <div key={item.id} className="py-4 md:py-8 border-b border-white/10 group cursor-pointer">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="w-8 h-8 md:w-12 md:h-12 shrink-0 rounded-xl bg-gradient-to-br to-white/20 from-transparent border border-white/10 flex items-center justify-center text-white group-hover:text-white group-hover:bg-white/10 transition-all mt-2 font-bold">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed pt-1">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-gray-400 italic">No mission points configured yet.</div>
            )}
          </div>
          <div
            className="w-full lg:w-1/2"
            data-aos="fade-left"
            data-aos-duration="2000"
          >
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center border border-white/5 shadow-2xl">
              <img
                src={visionImage}
                alt="Our Vision Graphic"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>
    ),
    LEADERSHIP: (
      <section className="relative bg-primary py-8 md:py-20 px-4 overflow-hidden font-sans">
        <div className="container mx-auto px-0 sm:px-6 lg:px-8 relative z-10">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white text-center mb-8 md:mb-12 tracking-tight leading-tight"
            data-aos="fade-up"
          >
            Leadership Team
          </h2>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-6xl mx-auto">
            {leadershipTeam.length > 0 ? (
              leadershipTeam.map((member) => (
                <div
                  key={member.id}
                  className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-br from-[#1E1A29] via-[#1E1A29] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden"
                >
                  <div className="relative w-full h-[320px] sm:h-[300px] md:h-[320px] lg:h-[300px] xl:h-[320px] rounded-t-2xl md:rounded-t-3xl overflow-hidden bg-white">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-2xl font-bold text-white">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="bg-gradient-to-r to-[#48112D] from-[#6C2C4A] p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-3xl flex-grow">
                    <div className="flex items-center justify-between gap-2 md:gap-4 mb-1 md:mb-2">
                      <h4 className="text-lg md:text-xl font-medium text-white tracking-wide">
                        {member.name}
                      </h4>
                      {member.linkedinUrl ? (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} LinkedIn profile`}
                          className="text-gray-200 transition-colors hover:text-secondary"
                        >
                          <svg
                            className="w-5 h-5 md:w-6 md:h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            stroke="none"
                          >
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      ) : null}
                    </div>
                    {member.designation ? (
                      <p className="text-gray-200 text-sm leading-relaxed max-w-[86%]">
                        {member.designation}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-gray-400 italic">No leadership team members configured yet.</div>
            )}
          </div>
        </div>
      </section>
    ),
    PRODUCT: (
      <section className="relative bg-primary py-8 md:py-20 px-4 overflow-hidden font-sans">
        <div className="absolute top-0 lg:top-[120px] left-0 -translate-y-1/2 -translate-x-1/2 w-[100%] h-[50%] md:w-[88%] md:h-[94%] bg-quaternary/60 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center, quaternary_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"></div>
        <div className="absolute top-0 lg:top-[120px] right-0 -translate-y-1/2 translate-x-1/2 w-[100%] h-[50%] md:w-[88%] md:h-[94%] bg-quaternary/60 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,quaternary_0_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"></div>

        <div className="container mx-auto px-0 sm:px-6 lg:px-8 relative z-10">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white text-center mb-8 md:mb-12 tracking-tight leading-tight"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            Key Product Team
          </h2>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-6xl mx-auto">
            {keyProductTeam.length > 0 ? (
              keyProductTeam.map((member) => (
                <div
                  key={member.id}
                  className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-br from-[#1E1A29] via-[#1E1A29] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden"
                >
                  <div className="relative aspect-square w-full h-[300px] md:h-[280px] rounded-t-2xl md:rounded-t-3xl overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-contain object-top bg-white"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-2xl font-bold text-white">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="bg-gradient-to-r to-[#48112D] from-[#6C2C4A] p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-3xl flex-grow">
                    <div className="flex items-center justify-center">
                      <h4 className="text-base md:text-lg lg:text-xl font-medium text-white tracking-wide">
                        {member.name}
                      </h4>
                    </div>
                    {member.designation ? (
                      <p className="text-gray-200 text-xs md:text-sm text-center mt-1">
                        {member.designation}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-gray-400 italic">No product team members configured yet.</div>
            )}
          </div>
        </div>
      </section>
    ),
  };

  return <main>{sectionOrder.map((key) => <div key={key}>{sectionsByKey[key] ?? null}</div>)}</main>;
}