'use client'; // Wajib: Menandakan ini adalah Client Component

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Award, Timer, AlertCircle, Loader2, Trophy, List } from 'lucide-react';

// --- 1. Data Soal (Bisa dipindahkan ke file terpisah atau database nanti) ---
const quizQuestions = [
    {
        questionText: "Apa fungsi utama dari Next.js dalam sebuah aplikasi React?",
        answerOptions: [
            { answerText: "Hanya untuk manajemen styling CSS", isCorrect: false },
            { answerText: "Server-Side Rendering (SSR) dan routing berbasis file", isCorrect: true },
            { answerText: "Sebagai pustaka state management global", isCorrect: false },
        ],
    },
    {
        questionText: "Bagaimana cara mendefinisikan rute dinamis seperti `/posts/1` di Next.js Pages Router?",
        answerOptions: [
            { answerText: "Menggunakan nama file `[id].js`", isCorrect: true },
            { answerText: "Menggunakan nama file `id.js`", isCorrect: false },
            { answerText: "Menggunakan nama file `post-id.js`", isCorrect: false },
        ],
    },
    {
        questionText: "Apa hook React yang ideal digunakan untuk mengambil data (data fetching) setelah komponen dipasang?",
        answerOptions: [
            { answerText: "useState", isCorrect: false },
            { answerText: "useMemo", isCorrect: false },
            { answerText: "useEffect", isCorrect: true },
        ],
    },
    {
        questionText: "Di React, elemen apa yang harus dimiliki oleh setiap item dalam daftar (list) yang dibuat dengan `map`?",
        answerOptions: [
            { answerText: "Properti `ref`", isCorrect: false },
            { answerText: "Properti `key`", isCorrect: true },
            { answerText: "Properti `index`", isCorrect: false },
        ],
    },
    {
        questionText: "Apa perintah yang benar untuk menjalankan mode pengembangan (development mode) Next.js?",
        answerOptions: [
            { answerText: "npm run start", isCorrect: false },
            { answerText: "npm run build", isCorrect: false },
            { answerText: "npm run dev", isCorrect: true },
        ],
    },
];

// Menerima prop 'user' yang dikirim dari Server Component (ExamPage)
export default function ExamClient({ user }) {
    
    // --- 2. State Kuis ---
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState(Array(quizQuestions.length).fill(null));
    const [showScore, setShowScore] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    
    const INITIAL_TIME = 300; // 5 Menit
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);

    // --- 3. Logika Timer ---
    useEffect(() => {
        // Hentikan timer jika skor sudah muncul (kuis selesai)
        if (showScore) return;

        // Auto-submit jika waktu habis
        if (timeLeft <= 0) {
            handleSubmitQuiz();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [showScore, timeLeft]); 

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // --- 4. Logika Navigasi & Jawaban ---
    const answeredCount = userAnswers.filter(answer => answer !== null).length;

    const handleAnswerSelection = (answerOptionIndex) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = answerOptionIndex;
        setUserAnswers(newAnswers);
    };

    const jumpToQuestion = (index) => setCurrentQuestionIndex(index);
    const goToNext = () => currentQuestionIndex < quizQuestions.length - 1 && setCurrentQuestionIndex(prev => prev + 1);
    const goToPrev = () => currentQuestionIndex > 0 && setCurrentQuestionIndex(prev => prev - 1);

    // --- 5. Logika Submit ke API ---
    const handleSubmitQuiz = async () => {
        if (isSaving) return;
        setIsSaving(true);

        let calculatedScore = 0;
        quizQuestions.forEach((question, index) => {
            const selectedIndex = userAnswers[index];
            if (selectedIndex !== null && question.answerOptions[selectedIndex].isCorrect) {
                calculatedScore += 1;
            }
        });

        try {
            const apiUrl = `${window.location.origin}/api/quiz`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,   // Menggunakan ID dari prop user
                    userName: user.name, // Menggunakan Nama dari prop user
                    score: calculatedScore,
                    totalQuestions: quizQuestions.length,
                    timeSpent: INITIAL_TIME - timeLeft,
                    answers: userAnswers,
                }),
            });

            if (response.ok) {
                setFinalScore(calculatedScore);
                setShowScore(true);
            } else {
                console.warn("Gagal menyimpan ke server, menampilkan hasil lokal.");
                setFinalScore(calculatedScore);
                setShowScore(true);
            }
        } catch (error) {
            console.error("Kesalahan Koneksi:", error);
            setFinalScore(calculatedScore);
            setShowScore(true);
        } finally {
            setIsSaving(false);
        }
    };

    // --- 6. Tampilan (Render) ---

    return (
        <div className="min-h-screen bg-slate-50 flex items-start justify-center p-0 lg:p-8 font-sans">
            <div className="w-full max-w-full lg:max-w-7xl bg-white shadow-2xl lg:rounded-2xl border border-slate-200 min-h-screen lg:min-h-0 overflow-hidden flex flex-col lg:flex-row mx-auto">
                
                {/* --- Sidebar Kiri (Navigasi) --- */}
                {!showScore && (
                    <div className="lg:w-80 bg-slate-900 text-white p-6 flex flex-col shrink-0 border-r border-slate-800">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <div className="overflow-hidden">
                                <h1 className="text-lg font-black tracking-tight leading-none">QUIZ APP</h1>
                                {/* Menampilkan nama user dari prop */}
                                <p className="text-[10px] text-blue-400 font-bold uppercase mt-1 tracking-widest truncate">
                                    {user.name}
                                </p>
                            </div>
                        </div>

                        {/* Timer Display */}
                        <div className={`mb-8 p-4 rounded-xl border-2 transition-all flex items-center justify-between ${timeLeft < 60 ? 'bg-red-500/10 border-red-500 animate-pulse' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center space-x-3">
                                <Timer className={`w-5 h-5 ${timeLeft < 60 ? 'text-red-400' : 'text-blue-400'}`} />
                                <span className={`text-2xl font-mono font-bold tracking-tighter ${timeLeft < 60 ? 'text-red-400' : 'text-slate-100'}`}>
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                            {timeLeft < 60 && <AlertCircle className="w-5 h-5 text-red-500" />}
                        </div>

                        {/* Grid Navigasi */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Daftar Soal</h3>
                                <List className="w-4 h-4 text-slate-500" />
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {quizQuestions.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => jumpToQuestion(index)}
                                        className={`h-10 rounded-lg font-bold text-sm transition-all ${
                                            index === currentQuestionIndex 
                                            ? 'bg-blue-600 text-white shadow-lg scale-105 z-10' 
                                            : userAnswers[index] !== null 
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/40' 
                                            : 'bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tombol Kirim */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <button 
                                onClick={handleSubmitQuiz}
                                disabled={isSaving}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold transition shadow-xl flex items-center justify-center space-x-2 active:scale-95"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>KIRIM JAWABAN</span>}
                            </button>
                        </div>
                    </div>
                )}

                {/* --- Area Konten Utama --- */}
                <div className="flex-1 flex flex-col bg-white">
                    {showScore ? (
                        /* Tampilan Skor Akhir */
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 animate-in fade-in duration-500">
                            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-200 max-w-lg w-full">
                                <div className="inline-block p-6 bg-yellow-100 rounded-full mb-6">
                                    <Award className="w-16 h-16 text-yellow-600" />
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 mb-2">Kuis Selesai!</h2>
                                <p className="text-slate-500 mb-8 font-medium">Terima kasih, <strong>{user.name}</strong>. Hasil Anda telah disimpan.</p>
                                
                                <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Skor Perolehan</p>
                                    <p className="text-6xl font-black text-blue-600">{finalScore} / {quizQuestions.length}</p>
                                </div>

                                <button 
                                    onClick={() => window.location.href = '/dashboard'}
                                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg active:scale-95"
                                >
                                    Pergi ke Dashboard
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Tampilan Soal Aktif */
                        <div className="flex-1 flex flex-col p-6 lg:p-16 max-w-4xl mx-auto w-full animate-in slide-in-from-right-4 duration-300">
                            <div className="mb-10 flex justify-between items-center border-b border-slate-100 pb-6">
                                <div>
                                    <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-1">Pertanyaan {currentQuestionIndex + 1} dari {quizQuestions.length}</p>
                                    <h2 className="text-2xl font-black text-slate-800">Soal Nomor {currentQuestionIndex + 1}</h2>
                                </div>
                                {userAnswers[currentQuestionIndex] !== null && (
                                    <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100 shadow-sm">
                                        <CheckCircle className="w-4 h-4 mr-2" /> Dijawab
                                    </span>
                                )}
                            </div>

                            <div className="mb-10">
                                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-snug">
                                    {quizQuestions[currentQuestionIndex].questionText}
                                </h3>
                            </div>

                            <div className="space-y-4 mb-12 flex-1">
                                {quizQuestions[currentQuestionIndex].answerOptions.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelection(index)}
                                        className={`w-full group text-left p-6 rounded-2xl border-2 transition-all duration-200 flex items-center space-x-5
                                            ${userAnswers[currentQuestionIndex] === index
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 transform scale-[1.01]'
                                                : 'bg-white border-slate-100 text-slate-700 hover:border-blue-200 hover:bg-blue-50/50'
                                            }`}
                                    >
                                        <span className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-lg transition-all
                                            ${userAnswers[currentQuestionIndex] === index 
                                                ? 'bg-white/20 border-white/20 text-white' 
                                                : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:border-blue-200 group-hover:text-blue-500'}`}>
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <span className="text-lg font-bold">{option.answerText}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center">
                                <button 
                                    onClick={goToPrev}
                                    disabled={currentQuestionIndex === 0}
                                    className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    <span>Kembali</span>
                                </button>
                                
                                {currentQuestionIndex < quizQuestions.length - 1 ? (
                                    <button 
                                        onClick={goToNext}
                                        className="flex items-center space-x-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:translate-x-1"
                                    >
                                        <span>Selanjutnya</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <div className="text-right">
                                        <span className="text-[10px] text-slate-400 uppercase font-black mb-1 block">Selesai?</span>
                                        <span className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg cursor-pointer" onClick={handleSubmitQuiz}>
                                            Kirim Sekarang
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}