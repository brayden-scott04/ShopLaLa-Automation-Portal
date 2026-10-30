import { Flame, Gem, HeartHandshake, Lightbulb, ShieldCheck, Trophy, type LucideIcon } from "lucide-react";
import { getLocale, getT } from "@/lib/i18n/server";

// The values themselves are company content written in both languages (not UI chrome), so both
// live here; the current language leads and the other is shown underneath.
type CoreValue = { name: string; nameZh: string; icon: LucideIcon; text: string; zh: string };

/** From the "# Core Value" sheet of the Performance and Development workbook. */
const CORE_VALUES: CoreValue[] = [
  {
    name: "Integrity",
    nameZh: "诚信",
    icon: ShieldCheck,
    text: "Ethically right in every part of the business — whether it is dealing with employees, working with the leaders, facing suppliers or customers. Always doing the right thing, even when no one’s watching.",
    zh: "在业务的每一个环节都保持道德正直——无论是对待员工、与领导合作、面对供应商或客户……始终做正确的事，即使无人监督。",
  },
  {
    name: "Passion",
    nameZh: "热情",
    icon: Flame,
    text: "Always have that fire in our hearts — finding purpose at work. This will go a long way, not just at work but also in our personal life, especially when it comes to challenges or obstacles in the workplace. Always head-on and with confidence.",
    zh: "永远保持心中的热情——在工作中找到意义。这不仅有助于工作，也能丰富我们的个人生活，尤其在面对挑战或障碍时，要自信迎接。",
  },
  {
    name: "Innovation",
    nameZh: "创新",
    icon: Lightbulb,
    text: "Challenging the current status with fresh ideas and curiosity. Look at things from a new perspective. Innovation is testing new approaches, learning from wins and failures, and always pushing for better.",
    zh: "以新思维和好奇心挑战现状。从新的角度看问题。创新就是尝试新方法，从成功与失败中学习，并不断追求更好。",
  },
  {
    name: "Teamwork",
    nameZh: "团队合作",
    icon: HeartHandshake,
    text: "Bringing together different skills and perspectives that enrich our company and make it better. Collaborating as a team drives innovation, team bonding, learning, and sharing the wins.",
    zh: "汇聚不同技能和观点，使公司更强大。团队协作推动创新、增强凝聚力、促进学习，并共同分享成果。",
  },
  {
    name: "Excellence",
    nameZh: "卓越",
    icon: Trophy,
    text: "Striving to go above and beyond every day. It’s pushing the boundaries of what’s possible and never settling for less than the highest quality of work.",
    zh: "每天都力求超越。不断突破可能的界限，绝不满足于低于最高质量的工作。",
  },
  {
    name: "Commitment",
    nameZh: "承诺",
    icon: Gem,
    text: "Showing up to work every day ready to give your best. It means believing in the work you’re producing, how it contributes to the bigger picture, and going the extra mile to ensure the job gets done.",
    zh: "每天都全力以赴投入工作。这意味着相信自己所做的工作、理解其对整体的贡献，并愿意付出额外努力确保任务完成。",
  },
];

export async function CoreValues() {
  const [t, locale] = await Promise.all([getT(), getLocale()]);
  const zhFirst = locale === "zh";
  return (
    <section className="mt-10">
      <div className="mb-4">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">{t("coreValues.eyebrow")}</p>
        <h3 className="mt-1 text-xl font-semibold text-foreground">{t("coreValues.title")}</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CORE_VALUES.map(({ name, nameZh, icon: Icon, text, zh }, i) => (
          <article
            key={name}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <span className="pointer-events-none absolute -top-3 right-3 text-7xl font-bold text-primary/5 select-none">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <h4 className="text-base font-semibold text-foreground">
                {zhFirst ? nameZh : name}
                <span className="ml-2 text-xs font-normal text-muted-foreground">{zhFirst ? name : nameZh}</span>
              </h4>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">{zhFirst ? zh : text}</p>
            <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
              {zhFirst ? text : zh}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
