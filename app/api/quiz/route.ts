import { NextResponse } from 'next/server';
import  prisma  from '@/app/lib/prisma';

/**
 * Mengambil daftar seluruh hasil kuis yang tersimpan.
 * Diurutkan berdasarkan waktu pengerjaan terbaru.
 */
export async function GET() {
  try {
    const results = await prisma.quizResult.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengambil data kuis' },
      { status: 500 }
    );
  }
}

/**
 * Menyimpan hasil kuis peserta ke database.
 * Menyimpan skor, durasi, dan detail jawaban yang dipilih.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const newResult = await prisma.quizResult.create({
      data: {
        userId: body.userId,
        score: body.score,
        totalQuestions: body.totalQuestions,
        timeSpent: body.timeSpent,
        // Pastikan field 'answers' ada di schema.prisma Anda (tipe Json atau String[])
        answers: body.answers, 
      },
    });
    
    return NextResponse.json(newResult);
  } catch (error) {
    console.error("Prisma Error:", error);
    return NextResponse.json(
      { error: 'Gagal menyimpan jawaban kuis' },
      { status: 500 }
    );
  }
}