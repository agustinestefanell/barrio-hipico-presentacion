import ViewerAccessForm from "./ViewerAccessForm";

export const dynamic = "force-dynamic";

export default async function ViewerAccessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="access-shell viewer-access-shell">
      <section className="access-card">
        <div className="access-brand" aria-hidden="true">
          <span>BH</span>
          <small>Invitación confidencial</small>
        </div>
        <p className="eyebrow">Presentación privada</p>
        <h1>Acceso a presentación</h1>
        <p className="access-lead">Ingresá el PIN de 4 dígitos recibido.</p>
        <ViewerAccessForm slug={slug} />
        <p className="access-help">
          El acceso puede tener vencimiento, límite de usos y bloqueo por intentos fallidos.
        </p>
      </section>
    </main>
  );
}
