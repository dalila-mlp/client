<script lang="ts">
    import { onMount } from "svelte";
    import { ToastContainer, FlatToast }  from "svelte-toasts";
    import SelectModel from "../../components/upload/SelectModel.svelte";
    import UploadedItem from "../../components/upload/UploadedItem.svelte";
    import toast from "../../utils/Toast/default";

    let modelNames: Array<string> = [];
    let modelTypes: Array<string> = [];

    onMount(async () => {
        const namesResponse = await fetch('http://localhost/model/names');
        modelNames = await namesResponse.json();

        const typesResponse = await fetch('http://localhost/model/types');
        modelTypes = await typesResponse.json();
    });

    interface Model {
        filename: string;
        id: string;
        name: string;
        type: string;
        weight: number;
        weightUnitSize: string;
    };

    let models: Model[] = [];
    let selectedModel: string = "Choose model name";
    let selectedType: string = "Choose model type";
    let file: File | null = null;
    let fileInput: HTMLInputElement | null = null;
    
    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;

        if (input.files && input.files[0]) {
            file = input.files[0];
        }
    }

    async function handleUpload() {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', selectedModel);
        formData.append('type', selectedType);

        try {
            const response = await fetch('http://localhost/model/create', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error((await response.json()).message);
            }

            toast('Model uploaded successfully!', 'success');

            const result = await response.json();
            models = [
                ...models,
                {
                    filename: result.filename,
                    id: result.id,
                    name: result.name,
                    type: result.type,
                    weight: result.weight,
                    weightUnitSize: result.weightUnitSize,
                }
            ];
            
            file = null;
            selectedModel = modelNames[0];
            selectedType = modelTypes[0];

            if (fileInput) {
                fileInput.value = '';
            }
        } catch (error) {
            toast(error.message, 'error');
        }
    }

    async function removeModel(id: string) {
        try {
            const response = await fetch(`http://localhost/model/${id}/delete`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error((await response.json()).message);
            }

            models = models.filter((model) => model.id !== id);
        } catch (error) {
            toast(error.message, 'error');
        }
    }
</script>

<div class="relative grid items-center max-w-[1400px] mx-auto w-full text-sm sm:text-base min-h-screen -mt-[76px]">
    {#if typeof window !== 'undefined'}
        <ToastContainer let:data={data}>
            <FlatToast {data} />
        </ToastContainer>
    {/if}
    <div class="flex flex-col items-center justify-self-center w-1/2 bg-[#15223C] rounded-3xl py-[34px]">
        <div class="flex flex-col items-center">
            <h1 class="text-3xl font-medium">Upload your model</h1>
            <span class="text-sm text-gray-500 font-bold">only .py extension is available</span>
        </div>
        <div class="flex flex-col items-center w-full mt-[21px]">
            <div class="flex flex-col items-center w-full">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Model</h2>
                <SelectModel bind:value={selectedModel} options={modelNames}/>
            </div>
            <div class="flex flex-col items-center w-full mt-[13px]">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Type</h2>
                <SelectModel bind:value={selectedType} options={modelTypes} />
            </div>
        </div>
        <div class="flex font-bold mt-[34px] text-white text-2xl">
            <input
              id="fileInput"
              type="file"
              accept=".py"
              on:change={handleFileChange}
              class="hidden"
              bind:this={fileInput}
            />
            {#if file}
                <UploadedItem {...{filename: file.name}} on:remove={() => {file = null; fileInput.value = '';}} />
            {:else}
                <label
                    class="bg-blue-500 hover:bg-blue-700 cursor-pointer px-[55px] py-[13px] rounded-2xl"
                    for="fileInput"
                >
                    Drag model here!
                </label>
            {/if}
        </div>
        {#if file && selectedModel && selectedType}
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-[55px] py-[13px] rounded-2xl mt-[34px] text-2xl"
                on:click={handleUpload}
            >
                Upload
            </button>
        {/if}
        {#if models.length > 0}
            <div class="relative flex flex-col w-3/4 mt-[34px]">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Just uploaded model(s)</h2>
                <div class="relative flex flex-col gap-3">
                    {#each models as model (model.id)}
                        <UploadedItem {...model} on:remove={() => removeModel(model.id)} />
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>
