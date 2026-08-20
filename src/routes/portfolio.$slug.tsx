import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Placeholder } from "@/components/PageShell";

export const Route = createFileRoute("/portfolio/$slug")({
  head: ({ params }) => {
    const title = `Case Study | JointHeirs DigiWorks Agency`;
    const description = "A detailed look at the brief, approach and measurable outcome of this project.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/portfolio/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/portfolio/${params.slug}` }],
    };
  },
  component: CaseStudyDetail,
});

function CaseStudyDetail() {
  const { slug } = Route.useParams();
  return (
    <PageShell eyebrow="Case Study" title={slug.replace(/-/g, " ")} intro="Dynamic case study detail page.">
      <Placeholder label="Client, challenge, solution, gallery, results and testimonial — managed from the admin dashboard." />
    </PageShell>
  );
}
