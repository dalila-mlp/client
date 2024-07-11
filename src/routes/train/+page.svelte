<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount, onDestroy } from "svelte";
    import { get } from 'svelte/store';
    import { ToastContainer, FlatToast }  from "svelte-toasts";
    import SelectModel from "../../components/upload/SelectModel.svelte";
    import { type Model, selectedModel } from '../../stores/model';
    import axios from "../../utils/Axios/axios";
    import toast from "../../utils/Toast/default";

    interface Datafile {
        filename: string;
        id: string;
        weight: number;
        weightUnitSize: string;
    }

    interface Option {
        id: string;
        filename: string;
    }

    let models: Model[] = [];
    let modelsOptions: Option[] = [];
    let models_loaded: boolean = false;
    let selectedModelValue: string = "";
    let displaySelectedModelValue: string | null = null;

    let datafiles: Datafile[] = [];
    let datafiles_loaded: boolean = false;
    let selectedDatafile: string = "";

    let trainingFinished: boolean = false;
    let trainingStarted: boolean = false;

    onMount(async () => {
        try {
            const response = await axios.get('/models');
            if(response.status !== 200) throw new Error((await response.data).message);
            const responseDatafile = await response.data;
            models = responseDatafile;
            modelsOptions = models.map(model => ({ id: model.id, filename: model.filename }));
        } catch (error) {
            toast(error.message, "error")
        }
        
        models_loaded = true;
        displaySelectedModelValue = get(selectedModel);
        selectedModelValue = modelsOptions.filter((option) => option.filename === displaySelectedModelValue)[0].id;
    });

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

    let targetColumn: string = "";
    let features: string = "";
    let testSize: string = "0.2";

    const train = async () => {
        trainingFinished = false;
        trainingStarted = true;

        try {
            const response = await axios.post(
                '/model/train',
                {
                    model_id: selectedModelValue,
                    datafile_id: selectedDatafile,
                    target_column: targetColumn,
                    features: features.split(',').map(f => f.trim()),
                    test_size: parseFloat(testSize),
                },
            );

            if(response.status !== 200) throw new Error((await response.data).message);

            toast('Training ended successfully!', 'success');
            const result = await response.data;
            console.log(result);

            goto(`/model/${result.model_id}`);
        } catch (error) {
            toast(error.message, 'error');
        } finally {
            trainingFinished = true;
            trainingStarted = false;
        }
    }
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
        {#if trainingStarted && !trainingFinished}
            <div class="w-full bg-yellow-300 text-black text-center py-2 my-[13px]">
                Training in progress...
            </div>
        {/if}
        <div class="flex flex-col items-center w-full mt-[21px]">
            <div class="flex flex-col items-center w-full">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Model</h2>
                <SelectModel
                    bind:value={selectedModelValue}
                    bind:specificValue={displaySelectedModelValue}
                    options={modelsOptions}
                    typeOption="model"
                />
            </div>
            <div class="flex flex-col items-center w-full mt-[13px]">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Datafile</h2>
                <SelectModel
                    bind:value={selectedDatafile}
                    options={datafiles.map(datafile => ({ id: datafile.id, filename: datafile.filename }))}
                    typeOption="datafile"
                />
            </div>
            <div class="flex flex-col items-center w-full mt-[13px]">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Target Column</h2>
                <input
                    type="text"
                    bind:value={targetColumn}
                    class="w-3/4 p-2 rounded text-black"
                    placeholder="Enter target column"
                />
            </div>
            <div class="flex flex-col items-center w-full mt-[13px]">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Features</h2>
                <input
                    type="text"
                    bind:value={features}
                    class="w-3/4 p-2 rounded text-black"
                    placeholder="Enter features separated by commas"
                />
            </div>
            <div class="flex flex-col items-center w-full mt-[13px]">
                <h2 class="w-3/4 text-lg font-medium mb-[5px]">Test Size</h2>
                <input
                    type="text"
                    bind:value={testSize}
                    class="w-3/4 p-2 rounded text-black"
                    placeholder="Enter test size (e.g., 0.2)"
                />
            </div>
        </div>
        <button
            on:click={train}
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-[55px] py-[13px] rounded-2xl mt-[34px] text-2xl"
            disabled={trainingStarted && !trainingFinished}
            class:opacity-50={trainingStarted && !trainingFinished}
            class:cursor-not-allowed={trainingStarted && !trainingFinished}
        >
            Train!
        </button>
    </div>
</div>
