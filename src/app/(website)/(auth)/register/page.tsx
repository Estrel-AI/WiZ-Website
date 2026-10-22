"use client";

import BusinessRegistrationForm from "@/src/components/auth/business-registration-form";
import DeveloperRegistrationForm from "@/src/components/auth/developer-registration-form";
import { usePlanCodes } from "@/src/hooks/use-plan-codes";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const { loading: planCodesLoading, codes: dynamicPlanCodes } = usePlanCodes();

  const [userType, setUserType] = useState<"developer" | "business">("developer");
  const [isLocked, setIsLocked] = useState(false);
  const [planId, setPlanId] = useState<number>(1);
  const [planName, setPlanName] = useState<string>("Starter Plan");
  const [formStep, setFormStep] = useState<"email" | "otp" | "details" | "success">("email");

  const fallbackCodes: Record<string, string> = useMemo(
    () => ({
      STARTER: "STARTER_MONTHLY",
      BUSINESS_ENTRY: "BUSINESS_ENTRY_MONTHLY",
      BUSINESS_STANDARD: "BUSINESS_STANDARD_MONTHLY",
    }),
    []
  );

  const planCode = useMemo(
    () => (key: string): string =>
      (dynamicPlanCodes && (dynamicPlanCodes as Record<string, string>)[key]) ||
      fallbackCodes[key] ||
      "",
    [dynamicPlanCodes, fallbackCodes]
  );

  useEffect(() => {
    if (!searchParams) return;
    const typeParam = searchParams.get("user_type") || searchParams.get("type");
    const planIdParam = searchParams.get("plan_id");
    const planNameParam = searchParams.get("plan_name") || searchParams.get("plan");

    if (typeParam === "business" || typeParam === "developer") {
      setUserType(typeParam);
      if (typeParam === "developer") {
        setPlanId(planIdParam ? parseInt(planIdParam, 10) : 1);
        setPlanName(planNameParam || "Starter Plan");
      } else {
        setPlanId(planIdParam ? parseInt(planIdParam, 10) : 2);
        setPlanName(planNameParam || "Business Plan");
      }
      if (planIdParam || planNameParam) {
        setIsLocked(true);
      }
    } else if (planNameParam) {
      if (planNameParam.toLowerCase().includes("business")) {
        setUserType("business");
        setPlanId(planIdParam ? parseInt(planIdParam, 10) : 2);
        setPlanName("Business Plan");
        setIsLocked(true);
      } else {
        setUserType("developer");
        setPlanId(planIdParam ? parseInt(planIdParam, 10) : 1);
        setPlanName("Starter Plan");
        setIsLocked(true);
      }
    }
  }, [searchParams]);

  return (
    <main>
      <section className="bg-[#110a10] text-white py-10 md:py-20 px-4 min-h-screen flex items-center justify-center font-sans relative overflow-hidden">
        <div className="md:block hidden absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 w-1/3 h-[50%] md:h-[88%] bg-quaternary/20 rounded-[50%] blur-[60px] pointer-events-none z-0" />
        <div className="md:block hidden absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-1/3 h-[50%] md:h-[88%] bg-quaternary/20 rounded-[50%] blur-[60px] pointer-events-none z-0" />
        <div className="w-full max-w-2xl bg-gradient-to-b to-primary from-[#251321] border border-white/20 rounded-2xl px-6 py-7 sm:px-10 sm:py-9 md:px-12 md:py-10 shadow-2xl relative z-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {!isLocked && formStep === "email" && (
            <div className="relative bg-[#1a0f17] rounded-full p-1.5 flex mb-8 border border-white/10">
              <div
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-3px)] bg-gradient-to-r from-[#912059] to-[#D87AAA] rounded-full shadow-lg transition-transform duration-300 ease-in-out"
                style={{ transform: userType === "developer" ? "translateX(0)" : "translateX(100%)" }}
              />
              <button
                type="button"
                onClick={() => { setUserType("developer"); setPlanId(1); setPlanName("Starter Plan"); }}
                className="relative z-10 flex-1 py-2.5 px-6 rounded-full text-sm font-medium transition-colors duration-300 text-white"
              >Developer</button>
              <button
                type="button"
                onClick={() => { setUserType("business"); setPlanId(2); setPlanName("Business Plan"); }}
                className="relative z-10 flex-1 py-2.5 px-6 rounded-full text-sm font-medium transition-colors duration-300 text-white"
              >Business</button>
            </div>
          )}
          <h2 className="text-xl md:text-2xl mb-2 font-bold text-center">
            {userType === "business" ? "Create a business account" : "Create a developer account"}
          </h2>
          {userType === "developer" ? (
            <DeveloperRegistrationForm planId={planId} planName={planName} showPlanBadge={isLocked} onStepChange={setFormStep} />
          ) : (
            <BusinessRegistrationForm planId={planId} planName={planName} showPlanBadge={isLocked} onStepChange={setFormStep} />
          )}
        </div>
      </section>
    </main>
  );
}
