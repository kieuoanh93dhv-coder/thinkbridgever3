import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instruction for ThinkBridge Socratic AI Tutor
const THINKBRIDGE_SYSTEM_INSTRUCTION = `
Bạn là "Gia sư Thông thái ThinkBridge" (ThinkBridge AI Tutor) – một người thầy/người bạn đồng hành kiên nhẫn, vui vẻ và tận tâm cho học sinh Việt Nam.
Triết lý giảng dạy cốt lõi: "Hỏi AI thông minh – Tự nghĩ trước khi xem đáp án".

Quy tắc bắt buộc:
1. KHÔNG BAO GIỜ đưa ra đáp số cuối cùng hoặc bài giải hoàn chỉnh ngay từ đầu.
2. Hướng dẫn theo phương pháp gợi mở từng bước (Socratic Method):
   - Bước 1: Nhận diện dữ kiện quan trọng và yêu cầu của đề bài.
   - Bước 2: Khám phá công thức hoặc định lý/quy luật cần dùng.
   - Bước 3: Đặt câu hỏi gợi ý để học sinh tự điền bước tiếp theo.
3. Luôn dùng giọng văn tiếng Việt tự nhiên, khuyến khích, khen ngợi nỗ lực tư duy của học sinh (Ví dụ: "Em nhận xét rất tinh tế!", "Một suy nghĩ rất hay!", "Gần đúng rồi, em hãy thử nhìn lại...").
4. Cấu trúc câu trả lời:
   - Lời động viên ngắn gọn + nhận xét suy nghĩ của học sinh.
   - Gợi ý cụ thể cho bước hiện tại (đánh dấu rõ [BƯỚC HIỆN TẠI]).
   - Câu hỏi định hướng để học sinh trả lời hoặc bấm nút "Tiếp tục".
5. Nếu yêu cầu là "request_solution" (Xem lời giải):
   - Giải thích từng bước thật chi tiết, rõ ràng và kèm nhận xét về bài học rút ra, cách tự làm lại lần sau.
6. Nếu học sinh vừa gửi bước tự thử (submit_attempt):
   - Đánh giá ngay nỗ lực của học sinh. Dù đúng hay có chỗ chưa chính xác, hãy khen ngợi tinh thần tự thử trước ("Thầy/Cô rất tự hào vì em đã tự tay đặt bút viết bước này!"). Sau đó phân tích bước tự thử và khen thưởng!
`;

// API endpoint for AI Tutor Chat
app.post('/api/tutor/chat', async (req, res) => {
  try {
    const {
      prompt,
      action = 'ask', // 'ask' | 'hint_more' | 'next_step' | 'request_solution' | 'submit_attempt'
      stepNumber = 1,
      studentAttempt = '',
      conversationHistory = [],
      imageData = null, // base64 string
    } = req.body;

    let userInstruction = '';

    if (action === 'hint_more') {
      userInstruction = `Học sinh đang ở bước ${stepNumber} và bấm nút "Gợi ý thêm". Em chưa hiểu hoặc cần gợi ý sâu hơn. Hãy cho một ví dụ nhỏ tương tự hoặc gợi ý liên tưởng dễ hiểu hơn mà VẪN KHÔNG LỘ ĐÁP SỐ. Câu hỏi của bài: "${prompt}".`;
    } else if (action === 'next_step') {
      userInstruction = `Học sinh bấm nút "Tiếp tục" để sang bước ${stepNumber + 1}. Hãy xác nhận bước trước và hướng dẫn bước tiếp theo. Đặt một câu hỏi mở để học sinh tư duy tiếp. Câu hỏi của bài: "${prompt}".`;
    } else if (action === 'request_solution') {
      userInstruction = `Học sinh đã hoàn thành hoặc đã vượt qua Cổng tự thử và bấm "Xem lời giải". Hãy trình bày lời giải chi tiết, chuẩn chỉnh theo từng bước, có kèm bài học rút ra và mẹo nhớ lâu. Câu hỏi của bài: "${prompt}". Bước học sinh đã tự làm: "${studentAttempt}".`;
    } else if (action === 'submit_attempt') {
      userInstruction = `Học sinh vừa vượt qua Cổng tự thử bằng cách gửi bài tự làm: "${studentAttempt}". Hãy khen ngợi tinh thần tự thử của học sinh nhiệt liệt! Nhận xét xem bước đó đúng hướng ra sao, chỉnh lại chỗ sơ suất (nếu có) và hướng dẫn tiếp theo một cách tràn đầy cảm hứng!`;
    } else {
      userInstruction = `Học sinh gửi câu hỏi bài tập: "${prompt}". Bắt đầu với BƯỚC 1: Phân tích đề bài, chỉ ra dữ kiện then chốt và hỏi học sinh một câu hỏi gợi ý đầu tiên để học sinh tự làm.`;
    }

    if (ai && apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const parts: any[] = [];
        if (imageData) {
          const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            parts.push({
              inlineData: {
                mimeType: matches[1],
                data: matches[2],
              },
            });
          }
        }
        parts.push({ text: userInstruction });

        // Add 7-second timeout to prevent hanging on placeholder/unreachable keys
        const generatePromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts },
          config: {
            systemInstruction: THINKBRIDGE_SYSTEM_INSTRUCTION,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 7000)
        );

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        const replyText = response.text || '';
        if (replyText.trim()) {
          return res.json({
            reply: replyText,
            source: 'gemini',
            awardedChestnuts: action === 'submit_attempt' ? 15 : 5,
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed or timed out, falling back to pedagogical engine:', geminiError?.message || geminiError);
      }
    }

    // High-quality pedagogical fallback when API key is not present or offline
    const fallbackReply = generatePedagogicalFallback({
      prompt,
      action,
      stepNumber,
      studentAttempt,
    });

    return res.json({
      reply: fallbackReply,
      source: 'pedagogical_engine',
      awardedChestnuts: action === 'submit_attempt' ? 15 : 5,
    });
  } catch (error: any) {
    console.error('Tutor chat error:', error);
    return res.status(500).json({
      error: 'Không thể xử lý yêu cầu gia sư lúc này',
      details: error.message,
    });
  }
});

// Intelligent Pedagogical Fallback generator for instant responsive offline/mock responses
function generatePedagogicalFallback({
  prompt,
  action,
  stepNumber,
  studentAttempt,
}: {
  prompt: string;
  action: string;
  stepNumber: number;
  studentAttempt: string;
}) {
  const p = (prompt || '').toLowerCase();

  if (action === 'submit_attempt') {
    return `🎉 **Tuyệt vời lắm! Thầy/Cô rất khen ngợi tinh thần tự thử của em!**

Em đã tự tay viết: *" ${studentAttempt} "*

👉 **Nhận xét tư duy:**
Em đã nắm bắt được ý chính của bài toán và không ngại thử sức. Đặt bút viết ra suy nghĩ của mình chính là bước đầu tiên của mọi nhà toán học & học giả xuất sắc!

🌰 **Thưởng nỗ lực:** +15 Hạt dẻ thông thái đã được cộng vào túi của em!
Bây giờ em có muốn chúng mình cùng kiểm tra kết quả chi tiết từng bước không?`;
  }

  if (action === 'request_solution') {
    return `🔓 **LỜI GIẢI CHI TIẾT & BÀI HỌC RÚT RA**

Cảm ơn em đã nỗ lực tự suy nghĩ trước khi mở xem đáp án!

📋 **Đề bài:** ${prompt || 'Bài toán của em'}

✨ **Các bước giải chi tiết:**
1. **Bước 1 (Đọc kỹ đề):** Tách bạch rõ đại lượng đã biết và đại lượng cần tìm. Đặt ẩn phụ hoặc vẽ sơ đồ đoạn thẳng nếu cần.
2. **Bước 2 (Thiết lập phương trình / biểu thức):** Vận dụng công thức cốt lõi tương ứng của dạng bài.
3. **Bước 3 (Biến đổi & tính toán cẩn thận):** Rút gọn từng vế, chú ý dấu âm/dương và điều kiện xác định.
4. **Bước 4 (Kết luận & Thử lại):** So sánh với điều kiện ban đầu để tránh nghiệm ngoại lai.

💡 **Mẹo ThinkBridge ghi nhớ:**
*"Sau mỗi bài tự giải, hãy tự hỏi: Nếu đề bài thay đổi một số liệu, mình sẽ biến đổi thế nào?"*`;
  }

  if (action === 'hint_more') {
    return `💡 **GỢI Ý THÊM CHO BƯỚC ${stepNumber}**

Đừng lo lắng nếu thấy hơi vướng, việc gặp khó khăn là dấu hiệu não bộ đang phát triển nơ-ron mới đấy!

🔍 **Manh mối thêm cho em:**
- Thử liên hệ bài này với một bài tập tương tự trong SGK.
- Hãy thử gán các số nhỏ hơn hoặc vẽ hình phác thảo ra giấy nháp.
- Đặt câu hỏi: *"Dữ kiện nào trong đề bài mà mình vẫn chưa dùng tới?"*

Em hãy thử viết nhẩm 1 phép tính ra nháp xem có bất ngờ gì không nhé!`;
  }

  if (action === 'next_step') {
    return `⏩ **BƯỚC ${stepNumber + 1}: TIẾP TỤC KHÁM PHÁ**

Rất tốt! Em đã vững vàng qua bước trước. Bây giờ chúng ta hãy tiến thêm một nấc:

1. Dựa trên dữ kiện ta vừa tìm ra, em hãy thử kết nối nó với câu hỏi chính của đề bài.
2. Em thấy có công thức nào liên kết trực tiếp giữa hai đại lượng này không?

Hãy gõ suy nghĩ của em vào ô chat hoặc bấm nút **"Gợi ý thêm"** nếu cần thầy gợi ý công thức nhé!`;
  }

  // Default 'ask'
  return `👋 **Chào em! Thầy/Cô gia sư ThinkBridge đây!**

Thầy đã nhận được bài của em:
📌 *"${prompt || 'Bài tập của em'}"*

🎯 **BƯỚC 1: XÁC ĐỊNH ĐÍCH ĐẾN & DỮ KIỆN**
Trước khi bắt tay vào giải, em hãy cho thầy biết:
- Đề bài cho ta những dữ kiện/con số quan trọng nào?
- Đích đến cuối cùng đề bài bắt ta phải tìm là gì?

*Gợi ý nhỏ: Em hãy thử liệt kê 2 thông tin đã biết ra nháp trước nhé! Sau đó bấm "Tiếp tục" hoặc "Gợi ý thêm" bất cứ khi nào em sẵn sàng!*`;
}

// Dev vs Prod Vite Integration
if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`ThinkBridge server listening on port ${PORT}`);
});
