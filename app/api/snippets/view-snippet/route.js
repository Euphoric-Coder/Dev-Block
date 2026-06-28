import { NextResponse } from "next/server";
import { db } from "@/lib/dbConfig";
import { currentUser } from "@clerk/nextjs/server";
import { CodeSnippet, snippetViews } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { snippetId } = await req.json();
    const user = await currentUser();
    const email = user.emailAddresses[0]?.emailAddress;

    if (!snippetId || !email) {
      return NextResponse.json({ error: "Missing snippetId or email" }, { status: 400 });
    }

    const [existingViewEntry] = await db
      .select()
      .from(snippetViews)
      .where(eq(snippetViews.snippetId, snippetId));

    if (existingViewEntry) {
      const hasViewed = existingViewEntry.viewers.some(
        (viewer) => viewer.email === email
      );

      if (hasViewed) {
        return NextResponse.json({ message: "Already viewed" }, { status: 200 });
      }

      const updatedViewers = [
        ...existingViewEntry.viewers,
        { email, viewedAt: new Date().toISOString() },
      ];

      const updatedTotalViews = parseInt(existingViewEntry.totalViews) + 1;

      await db
        .update(snippetViews)
        .set({
          viewers: updatedViewers,
          totalViews: updatedTotalViews.toString(),
        })
        .where(eq(snippetViews.snippetId, snippetId));

      // ⬇ Also update CodeSnippet.views
      const [blog] = await db.select().from(CodeSnippet).where(eq(CodeSnippet.id, snippetId));
      const blogViewsCount = parseInt(blog.views || "0") + 1;

      await db
        .update(CodeSnippet)
        .set({ views: blogViewsCount.toString() }) // or just .set({ views: blogViewsCount }) if using integer
        .where(eq(CodeSnippet.id, snippetId));
    } else {
      await db.insert(snippetViews).values({
        snippetId,
        viewers: [{ email, viewedAt: new Date().toISOString() }],
        totalViews: "1",
      });

      // Also initialize CodeSnippet.views
      await db
        .update(CodeSnippet)
        .set({ views: "1" }) // or 1 if integer
        .where(eq(CodeSnippet.id, snippetId));
    }

    return NextResponse.json({ message: "View registered" }, { status: 200 });
  } catch (error) {
    console.error("View registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
