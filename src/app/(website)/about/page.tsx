import type { Metadata } from "next";
import { buildWebsiteMetadata, websiteOgImages } from "@/src/lib/website-og";

export const metadata: Metadata = buildWebsiteMetadata({
  title: { absolute: "About WiiZ – Enterprise Agentic AI Platform & Company Vision" },
  description: "Discover the story behind WiiZ and the Team.",
  path: "/about",
  image: websiteOgImages.about,
});

export default function AboutPage() {
  return (
    <main>
      {/* Mission */}
      <main className="bg-primary min-h-[60vh] flex items-center justify-center relative overflow-hidden px-4 py-10 md:py-20 font-sans">
        <div className="md:block hidden absolute top-1/2  left-0 -translate-y-1/2 -translate-x-1/2 w-[160%] lg:w-[120%] xl:w-[90%] h-[100%] bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none  [-webkit-mask-image:radial-gradient(circle_at_center, quaternary_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"></div>
        <div className="md:block hidden absolute top-1/2  right-0 -translate-y-1/2 translate-x-1/2 w-[160%] lg:w-[120%] xl:w-[90%] h-[100%]  bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none [-webkit-mask-image:radial-gradient(circle_at_center,quaternary_0_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"></div>
        <div className="absolute -top-[250px] left-1/2 transform -translate-x-1/2 w-[600px] h-[500px] bg-gradient-about blur-[200px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-secondary/30 text-secondary text-[11px] md:text-xs font-bold tracking-widest uppercase bg-secondary/5 mb-3">
            Our Vision
          </span>
          <h1
            data-aos="fade-up"
            data-aos-duration="1000"
            className="text-3xl md:text-4xl lg:text-5xl leading-tight md:leading-[1.1] font-semibold text-white mb-3 md:mb-6 tracking-tight md:px-10"
          >
            The Enterprise AI Workforce Needs an Operating System
            {/* <span className="bg-gradient-to-r from-secondary to-[#E68F17] bg-clip-text text-transparent">
              on AI Agents
            </span> */}
          </h1>
          <p
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="200"
            className="text-base md:text-lg text-[#FDFDFD] max-w-4xl mx-auto md:px-16"
          >
            “We believe every enterprise will enhance itself with AI.
            WiiZ is building the operating system that enables enterprises to adopt AI at ease.”

          </p>
        </div>
      </main>
      {/* Vision  */}
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

            <div className="py-4 md:py-8 border-b border-white/10 group cursor-pointer">
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
                  To empower enterprises to design, deploy, and orchestrate AI
                  agents that automate complex workflows and unlock new levels
                  of productivity.
                </p>
              </div>
            </div>

            <div className="py-4 md:py-8 border-b border-white/10 group cursor-pointer">
              <div className="flex items-start gap-6">
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
                  To ensure that AI systems operate with trust, governance, and
                  transparency so organizations can scale AI responsibly.
                </p>
              </div>
            </div>

            <div className="py-4 md:py-8 border-b border-white/10 group cursor-pointer">
              <div className="flex items-start gap-6">
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
                  To create a unified platform where humans and AI agents
                  collaborate seamlessly to transform how businesses operate and
                  innovate.
                </p>
              </div>
            </div>
          </div>
          <div
            className="w-full lg:w-1/2"
            data-aos="fade-left"
            data-aos-duration="2000"
          >
            <div className="relative  rounded-2xl md:rounded-2xl md:rounded-3xl  overflow-hidden aspect-[4/3] flex items-center justify-center border border-white/5 shadow-2xl">
              <img
                src="/images/about_section.png"
                alt="AI Agents 3D Graphic"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership team */}
      <section className="relative bg-primary py-8 md:py-20 px-4 overflow-hidden font-sans">
        <div className="absolute top-0 lg:top-[120px] left-0 -translate-y-1/2 -translate-x-1/2 w-[100%] h-[50%] md:w-[88%] md:h-[94%] bg-quaternary/60 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center, quaternary_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"></div>
        <div className="absolute top-0 lg:top-[120px] right-0 -translate-y-1/2 translate-x-1/2 w-[100%] h-[50%]  md:w-[88%] md:h-[94%] bg-quaternary/60  bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,quaternary_0_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"></div>

        <div className="container mx-auto px-0 sm:px-6 lg:px-8 relative z-10">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white text-center mb-8 md:mb-12 tracking-tight leading-tight"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Leadership Team
          </h2>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* Card 1: Vishal Malhotra */}
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-r from-[#48112D]  to-[#6C2C4A] border border-white/10 rounded-2xl md:rounded-2xl md:rounded-3xl  flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden">
              <div className="relative w-full h-[320px] sm:h-[300px] md:h-[320px] lg:h-[300px] xl:h-[320px] rounded-t-2xl md:rounded-t-3xl overflow-hidden bg-white">
                <img
                  src="/images/team-images/leadership/Vishal Malhotra.jpg"
                  alt="Vishal Malhotra"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className=" bg-gradient-to-r to-[#48112D]  from-[#6C2C4A]  p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-2xl md:rounded-b-3xl  flex-grow">
                <div className="flex items-center justify-between gap-2 md:gap-4 mb-1 md:mb-2">
                  <h4 className="text-base md:text-lg lg:text-xl font-medium text-white tracking-wide">
                    Vishal Malhotra
                  </h4>
                  <span
                    aria-label="LinkedIn profile unavailable"
                    className="text-gray-200/60"
                  >
                    <a
                      href="https://www.linkedin.com/in/vishalamalhotra"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Vishal Malhotra LinkedIn profile"
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
                  </span>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed max-w-[86%] ">
                  Co-Founder - CEO
                </p>
              </div>
            </div>

            {/* Card 2: Mausam Hajela */}
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-br from-[#1E1A29] via-[#1E1A29] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl  flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden">
              <div className="relative w-full h-[320px] sm:h-[300px] md:h-[320px] lg:h-[300px] xl:h-[320px] rounded-t-2xl md:rounded-t-3xl overflow-hidden bg-white">
                <img
                  src="/images/team-images/leadership/Mausam Hajela_.jpg"
                  alt="Mausam Hajela"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="bg-gradient-to-r to-[#48112D]  from-[#6C2C4A]  p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-3xl  flex-grow">
                <div className="flex items-center justify-between gap-2 md:gap-4 mb-1 md:mb-2">
                  <h4 className="text-lg md:text-xl font-medium text-white tracking-wide">
                    Mausam Hajela
                  </h4>
                  <a
                    href="https://www.linkedin.com/in/mausumhajela"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Mausam Hajela LinkedIn profile"
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
                </div>
                <p className="text-gray-200 text-sm leading-relaxed max-w-[86%]">
                  Co-founder - Chief of Product and Strategy
                </p>
              </div>
            </div>

            {/* Card 3: Sachin Anchal */}
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-br from-[#1E1A29] via-[#1E1A29] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl  flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden">
              <div className="relative w-full h-[320px] sm:h-[300px] md:h-[320px] lg:h-[300px] xl:h-[320px] rounded-t-2xl md:rounded-t-3xl overflow-hidden bg-white">
                <img
                  src="/images/team-images/leadership/Sachin Anchal_.jpg"
                  alt="Sachin Anchal"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="bg-gradient-to-r to-[#48112D]  from-[#6C2C4A]  p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-3xl  flex-grow">
                <div className="flex items-center justify-between gap-2 md:gap-4 mb-1 md:mb-2">
                  <h4 className="text-lg md:text-xl font-medium text-white tracking-wide">
                    Sachin Anchal
                  </h4>
                  <span
                    aria-label="LinkedIn profile unavailable"
                    className="text-gray-200/60"
                  >
                    <a
                      href="https://www.linkedin.com/in/sachinanchal19"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Sachin Anchal LinkedIn profile"
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
                  </span>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed max-w-[86%]">
                  Co-founder - Chief of Tech Partnerships
                </p>
              </div>
            </div>

            {/* Card 4: Shruti Sinha */}
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-br from-[#1E1A29] via-[#1E1A29] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl  flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden">
              <div className="relative w-full h-[320px] sm:h-[300px] md:h-[320px] lg:h-[300px] xl:h-[320px] rounded-t-2xl md:rounded-t-3xl overflow-hidden bg-white">
                <img
                  src="/images/team-images/leadership/Shruti Sinha.jpg"
                  alt="Shruti Sinha"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="bg-gradient-to-r to-[#48112D]  from-[#6C2C4A]  p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-3xl  flex-grow">
                <div className="flex items-center justify-between gap-2 md:gap-4 mb-1 md:mb-2">
                  <h4 className="text-lg md:text-xl font-medium text-white tracking-wide">
                    Shruti Sinha
                  </h4>
                  <span
                    aria-label="LinkedIn profile unavailable"
                    className="text-gray-200/60"
                  >
                    <a
                      href="https://www.linkedin.com/in/shruti-sinha28"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Shruti Sinha LinkedIn profile"
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
                  </span>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed max-w-[86%]">
                  Head of Product Engineering
                </p>
              </div>
            </div>

            {/* Card 5: Anshumita Singh */}
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-br from-[#1E1A29] via-[#1E1A29] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl  flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden">
              <div className="relative w-full h-[320px] sm:h-[300px] md:h-[320px] lg:h-[300px] xl:h-[320px] rounded-t-2xl md:rounded-t-3xl overflow-hidden bg-white">
                <img
                  src="/images/team-images/leadership/Anshumita Singh_.jpg"
                  alt="Anshumita Singh"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="bg-gradient-to-r to-[#48112D]  from-[#6C2C4A] p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-3xl  flex-grow">
                <div className="flex items-center justify-between gap-2 md:gap-4 mb-1 md:mb-2">
                  <h4 className="text-lg md:text-xl font-medium text-white tracking-wide">
                    Anshumita Singh
                  </h4>
                  <span
                    aria-label="LinkedIn profile unavailable"
                    className="text-gray-200/60"
                  >
                    <a
                      href="https://www.linkedin.com/in/anshumita-singh-4658b918b"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Anshumita Singh LinkedIn profile"
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
                  </span>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed max-w-[86%]">
                  Head of AI Consulting and BFS Business Unit
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key product Team */}
      <section className="relative bg-primary py-8 md:py-20 px-4 overflow-hidden font-sans">
        <div className="absolute top-0 lg:top-[120px] left-0 -translate-y-1/2 -translate-x-1/2 w-[100%] h-[50%] md:w-[88%] md:h-[94%] bg-quaternary/60 bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center, quaternary_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"></div>
        <div className="absolute top-0 lg:top-[120px] right-0 -translate-y-1/2 translate-x-1/2 w-[100%] h-[50%]  md:w-[88%] md:h-[94%] bg-quaternary/60  bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none rounded-full [-webkit-mask-image:radial-gradient(circle_at_center,quaternary_0_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"></div>

        <div className="container mx-auto px-0 sm:px-6 lg:px-8 relative z-10">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl  font-semibold text-white text-center mb-8 md:mb-12 tracking-tight leading-tight"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            Key Product Team
          </h2>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* Card 1: Yamini Hire */}
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-br from-[#1E1A29] via-[#1E1A29] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-2xl md:rounded-3xl  flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden">
              <div className="relative aspect-square w-full  h-[300px] md:h-[280px]   rounded-t-2xl md:rounded-t-3xl overflow-hidden">
                <img
                  src="/images/team-images/product team/yamini-hire.jpg"
                  alt="Yamini Hire"
                  className="w-full h-full object-contain object-top bg-white"
                />
              </div>
              <div className="bg-gradient-to-r to-[#48112D]  from-[#6C2C4A]  p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-3xl  flex-grow">
                <div className="flex items-center justify-center">
                  <h4 className="text-base md:text-lg lg:text-xl font-medium text-white tracking-wide">
                    Yamini Hire
                  </h4>
                  {/* <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-secondary transition-colors"
                  >
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      stroke="none"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a> */}
                </div>
              </div>
            </div>

            {/* Card 2: Manish Gupta */}
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-br from-[#1E1A29] via-[#1E1A29] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl  flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden">
              <div className="relative aspect-square w-full  h-[300px] md:h-[280px]   rounded-t-2xl md:rounded-t-3xl overflow-hidden">
                <img
                  src="/images/team-images/product team/Manish Gupta.jpeg"
                  alt="Manish Gupta"
                  className="w-full h-full object-contain object-top bg-white"
                />
              </div>
              <div className="bg-gradient-to-r to-[#48112D]  from-[#6C2C4A]  p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-3xl  flex-grow">
                <div className="flex items-center justify-center ">
                  <h4 className="text-base md:text-lg lg:text-xl font-medium text-white tracking-wide">
                    Manish Gupta
                  </h4>
                  {/* <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-secondary transition-colors"
                  >
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      stroke="none"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a> */}
                </div>
              </div>
            </div>

            {/* Card 3: Shivam Kumar */}
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-br from-[#1E1A29] via-[#1E1A29] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl  flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden">
              <div className="relative aspect-square md:w-full h-[300px] md:h-[280px] w-auto rounded-t-2xl md:rounded-t-3xl overflow-hidden">
                <img
                  src="/images/team-images/product team/Shivam Kumar.jpeg"
                  alt="Shivam Kumar"
                  className="w-full h-full object-contain object-top bg-white"
                />
              </div>
              <div className="bg-gradient-to-r to-[#48112D]  from-[#6C2C4A]  p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-3xl  flex-grow">
                <div className="flex items-center justify-center ">
                  <h4 className="text-base md:text-lg lg:text-xl font-medium text-white tracking-wide">
                    Shivam Kumar
                  </h4>
                  {/* <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-secondary transition-colors"
                  >
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      stroke="none"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a> */}
                </div>
              </div>
            </div>

            {/* Card 4: Nishansha Negi */}
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-br from-[#1E1A29] via-[#1E1A29] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl  flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden">
              <div className="relative aspect-square w-full  h-[300px] md:h-[280px]   rounded-t-2xl md:rounded-t-3xl overflow-hidden">
                <img
                  src="
                  /images/team-images/product team/Nishansha Negi.jpeg"
                  alt="Nishansha Negi"
                  className="w-full h-full object-contain object-top bg-white"
                />
              </div>
              <div className="bg-gradient-to-r to-[#48112D]  from-[#6C2C4A]  p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-3xl  flex-grow">
                <div className="flex items-center justify-center">
                  <h4 className="text-base md:text-lg lg:text-xl font-medium text-white tracking-wide">
                    Nishansha Negi
                  </h4>
                  {/* <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-secondary transition-colors"
                  >
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      stroke="none"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a> */}
                </div>
              </div>
            </div>

            {/* Card 5: Varun Verma */}
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-br from-[#1E1A29] via-[#1E1A29] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl  flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden">
              <div className="relative aspect-square w-full  h-[300px] md:h-[280px]   rounded-t-2xl md:rounded-t-3xl overflow-hidden">
                <img
                  src="/images/team-images/product team/Varun Verma.jpeg"
                  alt="Varun Verma"
                  className="w-full h-full object-contain object-top bg-white"
                />
              </div>
              <div className="bg-gradient-to-r to-[#48112D]  from-[#6C2C4A]  p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-3xl  flex-grow">
                <div className="flex items-center justify-center ">
                  <h4 className="text-base md:text-lg lg:text-xl font-medium text-white tracking-wide">
                    Varun Verma
                  </h4>
                  {/* <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-secondary transition-colors"
                  >
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      stroke="none"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a> */}
                </div>
              </div>
            </div>

            {/* Card 6: Pravalika
             */}
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-br from-[#1E1A29] via-[#1E1A29] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl  flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden">
              <div className="relative aspect-square w-full  h-[300px] md:h-[280px]   rounded-t-2xl md:rounded-t-3xl overflow-hidden">
                <img
                  src="/images/team-images/product team/Pravalika.jpeg"
                  alt="Pravalika
"
                  className="w-full h-full object-contain object-top bg-white"
                />
              </div>
              <div className="bg-gradient-to-r to-[#48112D]  from-[#6C2C4A]  p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-3xl  flex-grow">
                <div className="flex items-center justify-center ">
                  <h4 className="text-base md:text-lg lg:text-xl font-medium text-white tracking-wide">
                    Pravalika Panchamurthi
                  </h4>
                  {/* <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-secondary transition-colors"
                  >
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      stroke="none"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a> */}
                </div>
              </div>
            </div>
            {/* Card 7:  Kasireddy Sai Shruthi
             */}
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-br from-[#1E1A29] via-[#1E1A29] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl  flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden">
              <div className="relative aspect-square w-full  h-[300px] md:h-[280px]   rounded-t-2xl md:rounded-t-3xl overflow-hidden">
                <img
                  src="/images/team-images/product team/kasireddy-sai-shruthi.jpg"
                  alt="Kasireddy Sai Shruthi"
                  className="w-full h-full object-contain object-top bg-white"
                />
              </div>
              <div className="bg-gradient-to-r to-[#48112D]  from-[#6C2C4A]  p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-3xl  flex-grow">
                <div className="flex items-center justify-center ">
                  <h4 className="text-base md:text-lg lg:text-xl font-medium text-white tracking-wide">
                    Kasireddy Sai Shruthi
                  </h4>
                  {/* <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-secondary transition-colors"
                  >
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      stroke="none"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a> */}
                </div>
              </div>
            </div>
              {/* Card 8:  Eshan Sharma
             */}
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-br from-[#1E1A29] via-[#1E1A29] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl  flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden">
              <div className="relative aspect-square w-full  h-[300px] md:h-[280px]   rounded-t-2xl md:rounded-t-3xl overflow-hidden">
                <img
                  src="/images/team-images/product team/Eshan.jpg"
                  alt="Eshan Sharma"
                  className="w-full h-full object-contain object-top bg-white"
                />
              </div>
              <div className="bg-gradient-to-r to-[#48112D]  from-[#6C2C4A]  p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-3xl  flex-grow">
                <div className="flex items-center justify-center ">
                  <h4 className="text-base md:text-lg lg:text-xl font-medium text-white tracking-wide">
                   Eshan Sharma
                  </h4>
                </div>
              </div>
            </div>
               {/* Card 9:  gowtham Sai
             */}
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-br from-[#1E1A29] via-[#1E1A29] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl  flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden">
              <div className="relative aspect-square w-full  h-[300px] md:h-[280px]   rounded-t-2xl md:rounded-t-3xl overflow-hidden">
                <img
                  src="/images/team-images/product team/gowtham.jpg"
                  alt="Gowtham Sai"
                  className="w-full h-full object-contain object-top bg-white"
                />
              </div>
              <div className="bg-gradient-to-r to-[#48112D]  from-[#6C2C4A]  p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-3xl  flex-grow">
                <div className="flex items-center justify-center ">
                  <h4 className="text-base md:text-lg lg:text-xl font-medium text-white tracking-wide">
                   Gowtham Sai
                  </h4>
                </div>
              </div>
            </div>

              {/* Card 10: saman-rashid
             */}
            <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-gradient-to-br from-[#1E1A29] via-[#1E1A29] to-[#9120595d] border border-white/10 rounded-2xl md:rounded-3xl  flex flex-col shadow-2xl transition-transform hover:-translate-y-1 duration-300 group overflow-hidden">
              <div className="relative aspect-square w-full  h-[300px] md:h-[280px]   rounded-t-2xl md:rounded-t-3xl overflow-hidden">
                <img
                  src="/images/team-images/product team/saman-rashid.jpg"
                  alt="Saman Rashid"
                  className="w-full h-full object-contain object-top bg-white"
                />
              </div>
              <div className="bg-gradient-to-r to-[#48112D]  from-[#6C2C4A]  p-4 md:p-6 text-left rounded-b-2xl md:rounded-b-3xl  flex-grow">
                <div className="flex items-center justify-center ">
                  <h4 className="text-base md:text-lg lg:text-xl font-medium text-white tracking-wide">
                   Saman Rashid
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
