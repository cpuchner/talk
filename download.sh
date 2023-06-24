echo "Creating directories for models..."
mkdir -p models/llama
mkdir -p models/whisper

# Ask the user for the URLs of the models they want to download, with default values
# read -p "Enter the URL for the llama model (default: https://huggingface.co/TheBloke/Nous-Hermes-13B-GGML/resolve/main/nous-hermes-13b.ggmlv3.q4_K_S.bin): " LLAMA_MODEL_URL
# LLAMA_MODEL_URL=${LLAMA_MODEL_URL:-https://huggingface.co/TheBloke/Nous-Hermes-13B-GGML/resolve/main/nous-hermes-13b.ggmlv3.q4_K_S.bin}

read -p "Enter the URL for the whisper model (default: https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.en.bin): " WHISPER_MODEL_URL
WHISPER_MODEL_URL=${WHISPER_MODEL_URL:-https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.en.bin}

# Extract the model names from the URLs
LLAMA_MODEL_NAME=$(basename $LLAMA_MODEL_URL)
WHISPER_MODEL_NAME=$(basename $WHISPER_MODEL_URL)

# Downloading model files from user-specified URLs (or default URLs) and save them to the specified directories
curl -L $LLAMA_MODEL_URL -o models/llama/$LLAMA_MODEL_NAME
curl -L $WHISPER_MODEL_URL -o models/whisper/$WHISPER_MODEL_NAME

