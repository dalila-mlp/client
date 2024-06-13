<script lang="ts">
    import { onMount } from "svelte";
    import { ToastContainer, FlatToast }  from "svelte-toasts";
    import SelectModel from "../../components/upload/SelectModel.svelte";
    import toast from "../../utils/Toast/default";

    interface Model {
        id: string;
        filename: string;
        name: string;
        type: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        uploadedBy: string;
        weight: number;
        weightUnitSize: string;
        flops: number;
        lastTrain: string;
        deployed: boolean;
    }

    let models: Model[] = [];
    let models_loaded: boolean = false;

    onMount(async () => {
        try {
            const response = await fetch('http://localhost/models');
            if (!response.ok) {
                throw new Error((await response.json()).message);
            }

            const responseDatafile = await response.json();
            models = responseDatafile;
        } catch (error) {
            toast(error.message, "error")
        }

        models_loaded = true;
    });

    interface Datafile {
        filename: string;
        id: string;
        weight: number;
        weightUnitSize: string;
    }

    let datafiles: Datafile[] = [];
    let datafiles_loaded: boolean = false;

    onMount(async () => {
        try {
            const response = await fetch('http://localhost/datafiles');

            if (!response.ok) {
                throw new Error((await response.json()).message);
            }

            const responseDatafile = await response.json();
            datafiles = responseDatafile;
        } catch (error) {
            toast(error.message, 'error');
        }

        datafiles_loaded = true;
    });

    let selectedModel: string = "Choose model";
    let selectedDatafile: string = "Choose datafile";
</script>

<div class="relative grid items-center max-w-[1400px] mx-auto w-full text-sm sm:text-base min-h-screen -mt-[76px]">
    {#if typeof window !== 'undefined'}
        <ToastContainer let:data={data}>
            <FlatToast {data} />
        </ToastContainer>
    {/if}
    <div class="flex flex-col items-center justify-self-center w-1/2 bg-[#15223C] rounded-3xl py-[34px]">
        <div class="flex flex-col items-center">
            <h1 class="text-3xl font-medium">Launch training</h1>
            <span class="text-sm text-gray-500 font-bold">chose model and datafile for training</span>
        </div>
        <div class="flex flex-col items-center w-full mt-[21px]">
            <div class="flex flex-col items-center w-full">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Model</h2>
                <SelectModel bind:value={selectedModel} options={models.map(model => model.filename)}/>
            </div>
            <div class="flex flex-col items-center w-full mt-[13px]">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Datafile</h2>
                <SelectModel bind:value={selectedDatafile} options={datafiles.map(model => model.filename)}/>
            </div>
        </div>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-[55px] py-[13px] rounded-2xl mt-[34px] text-2xl">
            Train!
        </button>
    </div>
</div>
