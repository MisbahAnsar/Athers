export async function GET() {
    return Response.json({
        success: true,
        data: 'Thanks babe'
    },
    {
        status: 200
    }
)
}