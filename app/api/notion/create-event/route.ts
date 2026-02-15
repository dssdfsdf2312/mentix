import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const notionToken = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!notionToken || !databaseId) {
      console.warn("Notion credentials not configured, skipping calendar event creation");
      return NextResponse.json({ success: false, message: "Notion not configured" });
    }

    const { client_name, client_email, date, start_time, duration, zoom_join_url } =
      await request.json();

    const startDateTime = new Date(`${date}T${start_time}Z`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: `Coaching: ${client_name}`,
                },
              },
            ],
          },
          Date: {
            date: {
              start: startDateTime.toISOString(),
              end: endDateTime.toISOString(),
            },
          },
          Email: {
            email: client_email,
          },
          Status: {
            select: {
              name: "Confirmed",
            },
          },
          ...(zoom_join_url
            ? {
                "Zoom Link": {
                  url: zoom_join_url,
                },
              }
            : {}),
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Notion API error:", error);
      return NextResponse.json(
        { error: "Failed to create Notion event" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, page_id: data.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Notion error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
