<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { get } from 'svelte/store';
    import { ToastContainer, FlatToast }  from "svelte-toasts";
    import SelectModel from "../../components/upload/SelectModel.svelte";
    import { type Model, selectedModel } from '../../stores/model';
    import axios from "../../utils/Axios/axios";
    import toast from "../../utils/Toast/default";

    let models: Model[] = [];
    let models_loaded: boolean = false;
    let selectedModelValue: string = "";
    let selectedDatafile: string = "Choose datafile";

    onMount(async () => {
        try {
            const response = await axios.get('/models');
            if(response.status !== 200) throw new Error((await response.data).message);
            const responseDatafile = await response.data;
            models = responseDatafile;
        } catch (error) {
            toast(error.message, "error")
        }

        models_loaded = true;
        selectedModelValue = get(selectedModel) ?? "Choose model";
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
            const response = await axios.get('/datafiles');
            if(response.status !== 200) throw new Error((await response.data).message);
            const responseDatafile = await response.data;
            datafiles = responseDatafile;
        } catch (error) {
            toast(error.message, 'error');
        }

        datafiles_loaded = true;
    });

    onDestroy(() => selectedModel.set(null));
</script>

<svelte:head>
    <title>Train - Dalila</title>
    <meta name="description" content="Run training on a specific model and datafile with our platform." />
</svelte:head>

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
                <SelectModel bind:value={selectedModelValue} options={models.map(model => model.filename)}/>
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
