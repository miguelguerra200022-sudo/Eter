import { NextResponse } from 'next/server';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const userKey = searchParams.get('key'); // Allow passing key from client if configured via UI

    if (!query) {
        return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const effectiveKey = userKey || TAVILY_API_KEY;
    const sources: ('tavily' | 'ddg')[] = [];

    // 1. TAVILY SEARCH (Primary)
    if (effectiveKey) {
        try {
            console.log(`🕵️‍♂️ Searching Tavily for: ${query}`);
            const response = await fetch('https://api.tavily.com/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: effectiveKey,
                    query: query,
                    search_depth: "basic",
                    include_answer: true,
                    include_images: false,
                    max_results: 5
                })
            });

            if (response.ok) {
                const data = await response.json();
                return NextResponse.json({
                    provider: 'tavily',
                    answer: data.answer, // Tavily's generated answer
                    results: data.results.map((r: any) => ({
                        title: r.title,
                        link: r.url,
                        snippet: r.content,
                        score: r.score
                    }))
                });
            } else {
                console.warn("Tavily Error:", response.status, await response.text());
            }
        } catch (e) {
            console.error("Tavily Exception:", e);
        }
    }

    // 2. DUCKDUCKGO FALLBACK (Scraping)
    // Only used if Tavily fails or no key
    try {
        console.log(`🦆 Falling back to DDG for: ${query}`);
        const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
            }
        });

        if (!response.ok) throw new Error("DDG Blocked/Error");

        const html = await response.text();
        const results: { title: string, link: string, snippet: string }[] = [];

        const resultRegex = /<div class="result__body">([\s\S]*?)<\/div>/g;
        let match;

        while ((match = resultRegex.exec(html)) !== null && results.length < 5) {
            const content = match[1];
            const titleMatch = /<a class="result__a" href="([\s\S]*?)">([\s\S]*?)<\/a>/.exec(content);
            const snippetMatch = /<a class="result__snippet"[\s\S]*?>([\s\S]*?)<\/a>/.exec(content);

            if (titleMatch) {
                results.push({
                    title: titleMatch[2].replace(/<[^>]*>?/gm, '').trim(),
                    link: titleMatch[1].replace(/&amp;/g, '&'),
                    snippet: snippetMatch ? snippetMatch[1].replace(/<[^>]*>?/gm, '').trim() : 'Resumen no disponible.'
                });
            }
        }

        return NextResponse.json({
            provider: 'ddg-scraper',
            results: results.length > 0 ? results : [{
                title: "Búsqueda Directa",
                link: "https://duckduckgo.com/?q=" + encodeURIComponent(query),
                snippet: "Resultados parseados vacíos. Haz clic para ver manualmente."
            }]
        });

    } catch (error: any) {
        console.error('Search API Error:', error);
        return NextResponse.json({
            error: 'Failed to fetch search results from any provider',
            details: error.message
        }, { status: 500 });
    }
}
